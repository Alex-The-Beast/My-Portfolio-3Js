import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const outputPath = path.join(root, 'src', 'data', 'learningUpdates.js')
const notionVersion = '2026-03-11'
let propertyNames

const loadLocalEnv = async () => {
  for (const fileName of ['.env.local', '.env']) {
    try {
      const file = await readFile(path.join(root, fileName), 'utf8')

      file.split(/\r?\n/).forEach((line) => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/)
        if (!match || process.env[match[1]]) return

        const value = match[2].replace(/^['"]|['"]$/g, '')
        process.env[match[1]] = value
      })
    } catch {
      // Missing env files are fine; CI can provide real environment variables.
    }
  }
}

const requiredEnv = (key) => {
  const value = process.env[key]
  if (!value) throw new Error(`Missing ${key}. Add it to .env.local or your deployment environment.`)
  return value
}

const notionFetch = async (endpoint, options = {}) => {
  const response = await fetch(`https://api.notion.com/v1${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${requiredEnv('NOTION_TOKEN')}`,
      'Content-Type': 'application/json',
      'Notion-Version': notionVersion,
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error(`Notion API error ${response.status}: ${data.message || JSON.stringify(data)}`)
    error.status = response.status
    error.body = data
    throw error
  }

  return data
}

const loadPropertyNames = () => {
  propertyNames = {
    title: process.env.NOTION_TITLE_PROPERTY || 'Name',
    slug: process.env.NOTION_SLUG_PROPERTY || 'Slug',
    category: process.env.NOTION_CATEGORY_PROPERTY || 'Category',
    status: process.env.NOTION_STATUS_PROPERTY || 'Status',
    date: process.env.NOTION_DATE_PROPERTY || 'Date',
    summary: process.env.NOTION_SUMMARY_PROPERTY || 'Summary',
    focus: process.env.NOTION_FOCUS_PROPERTY || 'Focus',
    published: process.env.NOTION_PUBLISHED_PROPERTY || 'Published',
  }
}

const plainText = (richText = []) => richText.map((item) => item.plain_text).join('').trim()

const getTitle = (properties) => plainText(properties[propertyNames.title]?.title) || 'Untitled update'

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const getSlugValue = (property) => {
  if (!property) return ''

  if (property.type === 'rich_text') return plainText(property.rich_text)
  if (property.type === 'title') return plainText(property.title)
  if (property.type === 'formula') return String(property.formula?.string || property.formula?.number || '')
  if (property.type === 'select') return property.select?.name || ''

  return ''
}

const getSlug = (properties, title, pageId) => {
  const rawSlug = getSlugValue(properties[propertyNames.slug])
  const slug = slugify(rawSlug || title)
  const fallback = pageId.replace(/-/g, '').slice(-8)

  return slug || fallback
}

const getRichText = (properties, name) => plainText(properties[name]?.rich_text)

const getSelectName = (property) => property?.select?.name || property?.status?.name || ''

const getMultiSelect = (property) => property?.multi_select?.map((item) => item.name) || []

const getDate = (properties) => {
  const dateProperty = properties[propertyNames.date]?.date?.start
  const rawDate = dateProperty || properties[propertyNames.date]?.created_time

  if (!rawDate) return new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })

  return new Date(rawDate).toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  })
}

const getBlockText = (block) => {
  const value = block[block.type]
  return plainText(value?.rich_text)
}

const getFileObjectUrl = (fileObject) => {
  if (!fileObject) return ''

  if (fileObject.type === 'external') return fileObject.external?.url || ''
  if (fileObject.type === 'file') return fileObject.file?.url || ''

  return ''
}

const getMissingMediaReason = (fileObject) => {
  if (!fileObject) return 'Notion returned this media block without file data.'
  if (fileObject.type === 'file_upload') return 'Notion returned a file_upload reference instead of a public download URL.'
  if (!fileObject.type) return 'This looks like an empty Notion image placeholder.'

  return `Notion returned unsupported media type: ${fileObject.type}.`
}

const normalizeBlock = (block) => {
  const text = getBlockText(block)

  switch (block.type) {
    case 'heading_1':
    case 'heading_2':
    case 'heading_3':
      return { type: 'heading', text }
    case 'paragraph':
      return text ? { type: 'paragraph', text } : null
    case 'bulleted_list_item':
    case 'numbered_list_item':
    case 'to_do':
      return text ? { type: 'note', text } : null
    case 'code':
      return {
        type: 'code',
        language: block.code?.language || 'text',
        text,
      }
    case 'quote':
      return text ? { type: 'quote', text } : null
    case 'callout':
      return text ? { type: 'callout', text } : null
    case 'image':
      {
        const caption = plainText(block.image?.caption)
        const url = getFileObjectUrl(block.image)

        return {
          type: url ? 'image' : 'image_placeholder',
          url,
          caption,
          notionMediaType: block.image?.type || '',
          reason: url ? '' : getMissingMediaReason(block.image),
        }
      }
    case 'file':
      {
        const caption = plainText(block.file?.caption)
        const url = getFileObjectUrl(block.file)

        return {
          type: url ? 'file' : 'file_placeholder',
          url,
          caption: caption || block.file?.name || 'Attached file',
          notionMediaType: block.file?.type || '',
          reason: url ? '' : getMissingMediaReason(block.file),
        }
      }
    case 'divider':
      return { type: 'divider' }
    default:
      return text ? { type: 'paragraph', text } : null
  }
}

const getPageBlocks = async (pageId) => {
  const blocks = []
  let startCursor

  do {
    const query = new URLSearchParams({ page_size: '100' })
    if (startCursor) query.set('start_cursor', startCursor)

    const data = await notionFetch(`/blocks/${pageId}/children?${query.toString()}`)
    blocks.push(...data.results.map(normalizeBlock).filter(Boolean))
    startCursor = data.has_more ? data.next_cursor : null
  } while (startCursor)

  return blocks
}

const getFirstDataSourceFromDatabase = async (databaseId) => {
  const database = await notionFetch(`/databases/${databaseId}`)
  const dataSourceId = database.data_sources?.[0]?.id

  if (!dataSourceId) {
    throw new Error(
      'No data source found in that Notion database. Open the database in Notion, share it with your integration, then add NOTION_DATA_SOURCE_ID directly if needed.',
    )
  }

  return dataSourceId
}

const getDataSourceId = async () => {
  const explicitDataSourceId = process.env.NOTION_DATA_SOURCE_ID

  if (explicitDataSourceId) {
    console.log(`Checking Notion data source: ${explicitDataSourceId}`)

    try {
      await notionFetch(`/data_sources/${explicitDataSourceId}`)
      return explicitDataSourceId
    } catch (error) {
      if (error.status !== 404) throw error

      console.warn('That ID was not reachable as a data source. Trying it as a database ID...')

      try {
        const dataSourceId = await getFirstDataSourceFromDatabase(explicitDataSourceId)
        console.log(`Resolved database ${explicitDataSourceId} to data source ${dataSourceId}`)
        return dataSourceId
      } catch (databaseError) {
        if (databaseError.status !== 404) throw databaseError

        throw new Error(
          [
            `Notion could not find ${explicitDataSourceId}.`,
            'Most likely fix: open the Notion database, click the three-dot menu, choose Connections/Add connections, and add your integration "portfolio cms for daily updates".',
            'Also confirm the ID is copied from the original database/data source, not from a linked database view.',
          ].join('\n'),
        )
      }
    }
  }

  const databaseId = requiredEnv('NOTION_DATABASE_ID')
  console.log(`Resolving Notion database to data source: ${databaseId}`)
  return getFirstDataSourceFromDatabase(databaseId)
}

const queryPages = async (dataSourceId) => {
  const body = {
    page_size: 50,
    result_type: 'page',
    sorts: [{ timestamp: 'last_edited_time', direction: 'descending' }],
  }

  const publishedFilterName = propertyNames.published
  if (publishedFilterName) {
    body.filter = {
      property: publishedFilterName,
      checkbox: { equals: true },
    }
  }
  console.log(`Querying Notion data source: ${dataSourceId}`)

  try {
    return await notionFetch(`/data_sources/${dataSourceId}/query`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (error) {
    if (!body.filter || error.status === 404) throw error

    console.warn(`Published checkbox filter was skipped: ${error.message}`)
    delete body.filter

    return notionFetch(`/data_sources/${dataSourceId}/query`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }
}

const pageToUpdate = async (page) => {
  const blocks = await getPageBlocks(page.id)
  const properties = page.properties || {}
  const title = getTitle(properties)
  const blockNotes = blocks.filter((block) => block.type === 'note').map((block) => block.text)
  const paragraphFallback = blocks.filter((block) => block.type === 'paragraph').map((block) => block.text)
  const summary = getRichText(properties, propertyNames.summary) || paragraphFallback[0] || ''

  return {
    id: page.id,
    date: getDate(properties),
    title,
    slug: getSlug(properties, title, page.id),
    category: getSelectName(properties[propertyNames.category]) || "Learning",
    status: getSelectName(properties[propertyNames.status]) || "Updated",
    summary,
    notes: blockNotes.length ? blockNotes : paragraphFallback.slice(1, 4),
    focus: getMultiSelect(properties[propertyNames.focus]),
    blocks,
    sourceUrl: page.url,
  };
}

const withUniqueSlugs = (updates) => {
  const seen = new Map()

  return updates.map((update) => {
    const baseSlug = update.slug || update.id.replace(/-/g, '').slice(-8)
    const count = seen.get(baseSlug) || 0
    seen.set(baseSlug, count + 1)

    if (!count) return { ...update, slug: baseSlug }

    return {
      ...update,
      slug: `${baseSlug}-${update.id.replace(/-/g, '').slice(-6)}`,
    }
  })
}

const main = async () => {
  await loadLocalEnv()
  loadPropertyNames()

  const dataSourceId = await getDataSourceId()
  const pages = await queryPages(dataSourceId)
  const updates = withUniqueSlugs(await Promise.all(pages.results.map(pageToUpdate)))

  const file = `// Generated by npm run sync:notion. Do not edit by hand.\nexport const learningUpdates = ${JSON.stringify(updates, null, 2)}\n`

  await writeFile(outputPath, file, 'utf8')
  console.log(`Synced ${updates.length} Notion updates to ${path.relative(root, outputPath)}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})

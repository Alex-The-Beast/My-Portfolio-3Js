const notionVersion = '2026-03-11'

let propertyNames

const requiredEnv = (env, key) => {
  const value = env[key]
  if (!value) throw new Error(`Missing ${key}. Add it to your Cloudflare Pages environment variables.`)
  return value
}

const notionFetch = async (env, endpoint, options = {}) => {
  const response = await fetch(`https://api.notion.com/v1${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${requiredEnv(env, 'NOTION_TOKEN')}`,
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

const loadPropertyNames = (env) => {
  propertyNames = {
    title: env.NOTION_TITLE_PROPERTY || 'Name',
    slug: env.NOTION_SLUG_PROPERTY || 'Slug',
    category: env.NOTION_CATEGORY_PROPERTY || 'Category',
    status: env.NOTION_STATUS_PROPERTY || 'Status',
    date: env.NOTION_DATE_PROPERTY || 'Created Date',
    updatedAt: env.NOTION_UPDATED_AT_PROPERTY || 'updated',
    summary: env.NOTION_SUMMARY_PROPERTY || 'Summary',
    focus: env.NOTION_FOCUS_PROPERTY || 'Focus',
    tags: env.NOTION_TAGS_PROPERTY || 'Tags',
    published: env.NOTION_PUBLISHED_PROPERTY || 'Published',
  }
}

const plainText = (richText = []) => richText.map((item) => item.plain_text).join('').trim()

// const getTitle = (properties) => plainText(properties[propertyNames.title]?.title) || 'Untitled update'

const getTitle = (properties) => {
  const titleProperty = Object.values(properties).find(
    (property) => property?.type === "title",
  );

  return plainText(titleProperty?.title) || "Untitled update";
};

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

const formatDate = (env, rawDate) => {
  if (!rawDate) return new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })

  return new Date(rawDate).toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
    timeZone: env.NOTION_DATE_TIME_ZONE || 'Asia/Kolkata',
  })
}

const getPropertyDate = (properties, name) => {
  const property = properties[name]

  return property?.date?.start || property?.created_time || property?.last_edited_time || ''
}

const getPublishedAt = (env, properties, page) =>
  formatDate(env, getPropertyDate(properties, propertyNames.date) || page.created_time)

const getUpdatedAt = (env, properties, page) =>
  formatDate(env, getPropertyDate(properties, propertyNames.updatedAt) || page.last_edited_time)

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
      return text ? { type: 'bullet', text } : null
    case 'numbered_list_item':
      return text ? { type: 'numbered', text } : null
    case 'to_do':
      return text ? { type: 'todo', text, checked: Boolean(block.to_do?.checked) } : null
    case 'code':
      return { type: 'code', language: block.code?.language || 'text', text }
    case 'quote':
      return text ? { type: 'quote', text } : null
    case 'callout':
      return text ? { type: 'callout', text } : null
    case 'image': {
      const caption = plainText(block.image?.caption)
      console.log(JSON.stringify(block.image, null, 2));
      const url = getFileObjectUrl(block.image)

      return {
        type: url ? 'image' : 'image_placeholder',
        url,
        caption,
        notionMediaType: block.image?.type || '',
        reason: url ? '' : getMissingMediaReason(block.image),
      }
    }
    case 'file': {
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

const getPageBlocks = async (env, pageId) => {
  const blocks = []
  let startCursor

  do {
    const query = new URLSearchParams({ page_size: '100' })
    if (startCursor) query.set('start_cursor', startCursor)

    const data = await notionFetch(env, `/blocks/${pageId}/children?${query.toString()}`)
    blocks.push(...data.results.map(normalizeBlock).filter(Boolean))
    startCursor = data.has_more ? data.next_cursor : null
  } while (startCursor)

  return blocks
}

const getFirstDataSourceFromDatabase = async (env, databaseId) => {
  const database = await notionFetch(env, `/databases/${databaseId}`)
  const dataSourceId = database.data_sources?.[0]?.id

  if (!dataSourceId) {
    throw new Error(
      'No data source found in that Notion database. Share the database with your integration, then set NOTION_DATA_SOURCE_ID directly if needed.',
    )
  }

  return dataSourceId
}

const getDataSourceId = async (env) => {
  const explicitDataSourceId = env.NOTION_DATA_SOURCE_ID

  if (explicitDataSourceId) {
    try {
      await notionFetch(env, `/data_sources/${explicitDataSourceId}`)
      return explicitDataSourceId
    } catch (error) {
      if (error.status !== 404) throw error
      return getFirstDataSourceFromDatabase(env, explicitDataSourceId)
    }
  }

  return getFirstDataSourceFromDatabase(env, requiredEnv(env, 'NOTION_DATABASE_ID'))
}

const queryPages = async (env, dataSourceId) => {
  const body = {
    page_size: Number(env.NOTION_PAGE_SIZE || 50),
    result_type: 'page',
    sorts: [{ timestamp: 'last_edited_time', direction: 'descending' }],
  }

  if (propertyNames.published) {
    body.filter = {
      property: propertyNames.published,
      checkbox: { equals: true },
    }
  }

  try {
    return await notionFetch(env, `/data_sources/${dataSourceId}/query`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (error) {
    if (!body.filter || error.status === 404) throw error
    delete body.filter

    return notionFetch(env, `/data_sources/${dataSourceId}/query`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }
}

const pageToUpdate = async (env, page) => {
  const blocks = await getPageBlocks(env, page.id)
  const properties = page.properties || {}
  const title = getTitle(properties)
  const blockNotes = blocks
    .filter((block) => ['bullet', 'numbered', 'todo', 'note'].includes(block.type))
    .map((block) => block.text)
  const paragraphFallback = blocks.filter((block) => block.type === 'paragraph').map((block) => block.text)
  const summary = getRichText(properties, propertyNames.summary) || paragraphFallback[0] || ''

  return {
    id: page.id,
    date: getPublishedAt(env, properties, page),
    publishedAt: getPublishedAt(env, properties, page),
    updatedAt: getUpdatedAt(env, properties, page),
    title,
    slug: getSlug(properties, title, page.id),
    category: getSelectName(properties[propertyNames.category]) || 'Learning',
    status: getSelectName(properties[propertyNames.status]) || 'Updated',
    summary,
    notes: blockNotes.length ? blockNotes : paragraphFallback.slice(1, 4),
    focus: getMultiSelect(properties[propertyNames.focus]),
    tags: getMultiSelect(properties[propertyNames.tags]),
    blocks,
    sourceUrl: page.url,
  }
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

export const fetchLearningUpdates = async (env) => {
  loadPropertyNames(env)

  const dataSourceId = await getDataSourceId(env)
  const pages = await queryPages(env, dataSourceId)
  const updates = await Promise.all(pages.results.map((page) => pageToUpdate(env, page)))

  return withUniqueSlugs(updates)
}

import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'

const initialForm = {
  name: '',
  email: '',
  message: '',
}

const Contact = () => {
  const formRef = useRef(null)
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState(5)

  const handleChange = ({ target: { name, value } }) => {
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      await emailjs.send(
        'service_yjviezr',
        'template_sx5qcos',
        {
          from_name: form.name,
          to_name: 'xmas',
          from_email: form.email,
          to_email: 'xmas.96.tree@gmail.com',
          message: form.message,
        },
        'gVFeMfglA_MTf4qB6',
      )

      alert('Your message has been sent!')
      setForm(initialForm)
    } catch (error) {
      console.error(error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setRows(window.innerWidth < 768 ? 1 : 4)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <section id="contact">
      <div className="c-space my-20">
        <div className="relative flex min-h-screen flex-col items-center justify-center">
          <img src="/assets/terminal.png" alt="terminal" className="absolute inset-0 min-h-screen" />
          <div className="contact-container">
            <h3 className="head-text sm:mt-20">Let&apos;s talk</h3>
            <p className="mt-3 text-lg text-white-600">
              Whether you&apos;re looking to build a new website, improve your existing platform, or bring a unique project to life, I&apos;m here to help.
            </p>

            <form ref={formRef} onSubmit={handleSubmit} className="mt-12 flex flex-col space-y-7">
              <label className="space-y-3">
                <span className="field-label">Full Name</span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="field-input"
                  placeholder="ex., Gaurav Kumar"
                />
              </label>

              <label className="space-y-3">
                <span className="field-label">Email address</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="field-input"
                  placeholder="ex., xmas.tree.96@gmail.com"
                />
              </label>

              <label className="space-y-3">
                <span className="field-label">Your message</span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={rows}
                  className="field-input"
                  placeholder="Share your thoughts or inquiries..."
                />
              </label>

              <button className="field-btn" type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
                <img src="/assets/arrow-up.png" alt="" className="field-btn_arrow" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact

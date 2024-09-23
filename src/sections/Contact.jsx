import React, { useRef, useState ,useEffect} from  'react'
import emailjs from '@emailjs/browser'
const Contact=()=>{
    const formRef=useRef()
    const [loading,setLoading]=useState(false)
    const [form,setForm] =useState({
        name:'',
        email:'',
        message:''
    })

    const handleChange=({target:{name,value}})=>{
        setForm({...form,[name]:value})
    }
    const handleSubmit= async(e)=>{
        e.preventDefault()
        setLoading(true)
        
        try{
           await emailjs.send(
                'service_yjviezr',
                'template_sx5qcos',
                //curretnly there is issue in template id.
                 {
                     from_name:form.name,
                     to_name:'xmas',
                     from_email:form.email,
                     to_email:'xmas.96.tree@gmail.com',
                     message:form.message
                 },'gVFeMfglA_MTf4qB6'
     
     
             )
             setLoading(false)
             alert('Your message has been sent! ❤')

             setForm({
                name:'',
                email:'',
                message:''
             })

        }
        catch(error){
            setLoading(false)
            console.log(error)
            alert('something went wrong')

        }

     

    }



    const [rows, setRows] = useState(5); // Default rows based on screen size

  // Function to handle the window resize
  const handleResize = () => {
    const screenWidth = window.innerWidth;
    setRows(screenWidth < 768 ? 1 : 5); // 3 rows for small screens, 5 rows for larger screens
  };

  useEffect(() => {
    // Set rows based on initial screen size
    handleResize();

    // Add event listener for screen resizing
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

    //service_yjviezr
    return (
        <section>
            <div className='c-space my-20'>
                <div className='relative min-h-screen flex items-center justify-center
                flex-col'>
                    <img src="/assets/terminal.png" alt='terminal'className='absolute 
                    inset-0 min-h-screen' />
                    <div className='contact-container'>
                        <h3 className="head-text">Let's talk</h3>
                        <p className="text-lg text-white-600 mt-3">Whether you're looking to build 
                            a new website, improve your existing platform, or bring a unique project to 
                            life, I'm here to help.
                        </p>

                        <form ref={formRef} onSubmit={handleSubmit} 
                        className='mt-12 flex flex-col space-y-7'>
                            <label className='space-y-3'>
                                <span className='field-label'>Full Name</span>
                                <input
                                type="text"
                                name='name'
                                value={form.name}
                                onChange={handleChange}
                                required
                                className='field-input'
                                placeholder='ex., Gaurav kumar'
                                />
                            </label>

                            <label className='space-y-3'>
                                <span className='field-label'>Email address</span>
                                <input
                                type="email"
                                name='email'
                                value={form.email}
                                onChange={handleChange}
                                required
                                className='field-input'
                                placeholder='ex., xmas.tree.96@gmail.com'
                                />
                            </label>

                            <label className='space-y-3'>
                                <span className='field-label'>Your message</span>
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

              <img src="/assets/arrow-up.png" alt="arrow-up" className="field-btn_arrow" />
            </button>



                        </form>
                    </div>
                    </div>
            </div>
            </section>

    )
}
export default Contact
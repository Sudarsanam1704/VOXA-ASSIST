import React, { useEffect } from "react";

const About = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const heading = { fontSize: '2rem', fontWeight: 'bold', color: '#4f46e5' };
  const subheading = { fontSize: '1.5rem', fontWeight: 'bold', color: '#4f46e5' };
  const container = {
    padding: '40px',
    backgroundColor: '#ffffff',
    color: '#000000',
    animation: 'fadeUp 1s ease-out',
  };

  return (
    <div style={container}>
      {/* ABOUT US */}
      <section>
        <h1 style={heading}>About Us</h1>
        <p style={{ textAlign: 'justify' }}>
          We are a cutting-edge technology company passionate about delivering value through innovation. 
          Our mission is to help businesses scale efficiently by leveraging modern technologies that are secure, scalable, and future-ready. 
          With a team of seasoned professionals across software development, security, cloud infrastructure, AI, and marketing, 
          we transform business ideas into high-impact digital solutions. Our collaborative approach ensures transparency, 
          creativity, and exceptional execution every step of the way. Whether you're a startup, SMB, or enterprise, 
          we are your trusted technology partner committed to long-term success.
        </p>
      </section>

      {/* SERVICES */}
      <section style={{ marginTop: '40px' }}>
        <h2 style={subheading}>Our Services</h2>
        <ul style={{ lineHeight: '2', paddingLeft: '20px' }}>
          <li style={{ textAlign: 'justify' }}>
            <b style={{ color: '#4f46e5' }}> Web Development:</b>  
            We create intuitive, fast, and responsive web applications tailored to your business needs. 
            From static websites to complex portals, we build scalable and maintainable full-stack solutions using 
            the latest technologies like React, Node.js, MongoDB, and PostgreSQL. Our UIs are pixel-perfect, 
            optimized for performance, SEO-friendly, and built with accessibility in mind.
          </li>

          <li style={{ textAlign: 'justify' }}>
            <b style={{ color: '#4f46e5' }}> DevOps:</b>  
            We streamline your development and operations workflow through robust DevOps practices. 
            From CI/CD pipelines to infrastructure as code (IaC), containerization with Docker, and deployment on AWS or Azure, 
            our DevOps experts ensure faster delivery, lower downtime, and more control. We also help set up monitoring and 
            logging to gain real-time visibility into your systems.
          </li>

          <li style={{ textAlign: 'justify' }}>
            <b style={{ color: '#4f46e5' }}> Cybersecurity:</b>  
            Security is at the core of everything we do. Our cybersecurity specialists conduct vulnerability assessments, 
            penetration testing, and implement proactive defense mechanisms to secure your applications and infrastructure. 
            We help you adhere to compliance standards like GDPR, HIPAA, and ISO by integrating secure coding, firewalls, 
            IDS/IPS, and endpoint protection across your environment.
          </li>

          <li style={{ textAlign: 'justify' }}>
            <b style={{ color: '#4f46e5' }}> Artificial Intelligence & Machine Learning (AI/ML):</b>  
            We harness the power of AI and ML to build smart applications that can automate processes, generate insights, 
            and improve customer experiences. From predictive analytics and recommendation engines to computer vision 
            and NLP-powered chatbots, we implement custom models and integrate pre-trained ones using Python, TensorFlow, 
            and PyTorch.
          </li>

          <li style={{ textAlign: 'justify' }}>
            <b style={{ color: '#4f46e5' }}> Digital Marketing:</b>  
            Grow your digital presence with our data-driven marketing strategies. We provide services in SEO, PPC advertising, 
            social media marketing, content strategy, and email campaigns. Our team crafts compelling content and leverages 
            analytics to optimize conversion rates and boost ROI. Whether you're launching a product or growing your brand, 
            we help you reach the right audience at the right time.
          </li>
        </ul>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ marginTop: '40px' }}>
        <h2 style={subheading}>Client Testimonials</h2>
        <blockquote style={{ textAlign: 'justify', fontStyle: 'italic', marginTop: '20px', borderLeft: '4px solid #4f46e5', paddingLeft: '15px' }}>
          “Partnering with this team was one of the best business decisions we made. Their technical expertise and proactive 
          approach helped us launch our product ahead of schedule with rock-solid security.”
          <br /><b>- Karan Patel, CTO, MedSecure</b>
        </blockquote>
        <blockquote style={{ textAlign: 'justify', fontStyle: 'italic', marginTop: '20px', borderLeft: '4px solid #4f46e5', paddingLeft: '15px' }}>
          “Their DevOps and AI/ML implementation transformed how we operate. We saw a 40% increase in efficiency within months.”
          <br /><b>- Sunita Jain, COO, SmartAgro</b>
        </blockquote>
        <blockquote style={{textAlign: 'justify', fontStyle: 'italic', marginTop: '20px', borderLeft: '4px solid #4f46e5', paddingLeft: '15px' }}>
          “They didn’t just develop a site—they built our digital brand. Our online presence and engagement have skyrocketed.”
          <br /><b>- Rajeev Bansal, Founder, Edunova</b>
        </blockquote>
      </section>
    </div>
  );
};

export default About;

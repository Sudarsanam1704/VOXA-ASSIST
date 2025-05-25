import React from 'react';

const SiteContent = () => {
  return (
    <div className="p-6 space-y-6" style={{ display: 'none' }}>
      <h1 className="text-2xl font-bold">Empowering Innovation Through Technology</h1>
      <p>
        Welcome to our technology hub, where ideas meet innovation. We specialize in building
        custom digital experiences for modern businesses. From secure web apps to AI-driven
        platforms, we help you scale with confidence. We bring strategy, design, and engineering
        together under one roof.
      </p>

      <h2 className="text-xl font-semibold">Tech</h2>
      <p>
        Delivering End-to-End Digital Solutions. Our services span across development, operations,
        security, AI/ML, and digital marketing. With each project, we commit to excellence, speed,
        and measurable outcomes. We adopt agile methods, cutting-edge tools, and best security
        practices to keep your systems resilient and users happy.
      </p>

      <h2 className="text-xl font-semibold">About Us</h2>
      <p>
        We are a cutting-edge technology company passionate about delivering value through
        innovation. Our mission is to help businesses scale efficiently by leveraging modern
        technologies that are secure, scalable, and future-ready. With a team of seasoned
        professionals across software development, security, cloud infrastructure, AI, and
        marketing, we transform business ideas into high-impact digital solutions. Our
        collaborative approach ensures transparency, creativity, and exceptional execution every
        step of the way. Whether you're a startup, SMB, or enterprise, we are your trusted
        technology partner committed to long-term success.
      </p>

      <h2 className="text-xl font-semibold">Our Services</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Web Development:</strong> We create intuitive, fast, and responsive web
          applications tailored to your business needs. From static websites to complex portals, we
          build scalable and maintainable full-stack solutions using the latest technologies like
          React, Node.js, MongoDB, and PostgreSQL. Our UIs are pixel-perfect, optimized for
          performance, SEO-friendly, and built with accessibility in mind.
        </li>
        <li>
          <strong>DevOps:</strong> We streamline your development and operations workflow through
          robust DevOps practices. From CI/CD pipelines to infrastructure as code (IaC),
          containerization with Docker, and deployment on AWS or Azure, our DevOps experts ensure
          faster delivery, lower downtime, and more control. We also help set up monitoring and
          logging to gain real-time visibility into your systems.
        </li>
        <li>
          <strong>Cybersecurity:</strong> Security is at the core of everything we do. Our
          cybersecurity specialists conduct vulnerability assessments, penetration testing, and
          implement proactive defense mechanisms to secure your applications and infrastructure. We
          help you adhere to compliance standards like GDPR, HIPAA, and ISO by integrating secure
          coding, firewalls, IDS/IPS, and endpoint protection across your environment.
        </li>
        <li>
          <strong>AI & ML:</strong> We harness the power of AI and ML to build smart applications
          that can automate processes, generate insights, and improve customer experiences. From
          predictive analytics and recommendation engines to computer vision and NLP-powered
          chatbots, we implement custom models and integrate pre-trained ones using Python,
          TensorFlow, and PyTorch.
        </li>
        <li>
          <strong>Digital Marketing:</strong> Grow your digital presence with our data-driven
          marketing strategies. We provide services in SEO, PPC advertising, social media
          marketing, content strategy, and email campaigns. Our team crafts compelling content and
          leverages analytics to optimize conversion rates and boost ROI. Whether you're launching
          a product or growing your brand, we help you reach the right audience at the right time.
        </li>
      </ul>

      <h2 className="text-xl font-semibold">Client Testimonials</h2>
      <blockquote>
        “Partnering with this team was one of the best business decisions we made. Their technical
        expertise and proactive approach helped us launch our product ahead of schedule with
        rock-solid security.” <br />
        – <strong>Karan Patel, CTO, MedSecure</strong>
      </blockquote>
      <blockquote>
        “Their DevOps and AI/ML implementation transformed how we operate. We saw a 40% increase in
        efficiency within months.” <br />
        – <strong>Sunita Jain, COO, SmartAgro</strong>
      </blockquote>
      <blockquote>
        “They didn’t just develop a site—they built our digital brand. Our online presence and
        engagement have skyrocketed.” <br />
        – <strong>Rajeev Bansal, Founder, Edunova</strong>
      </blockquote>

      <h2 className="text-xl font-semibold">Contact Information</h2>
      <p>
        <strong>Phone:</strong> +91 89405 13404 <br />
        <strong>Email:</strong> sudhar@gmail.com <br />
        <strong>Address:</strong> Salem
      </p>

      <h2 className="text-xl font-semibold">Call to Action</h2>
      <p>
        Let’s Collaborate and Build Something Amazing. Have a project in mind? Need help scaling
        your tech stack? Book a call with our experts and let's discuss how we can bring your
        vision to life. Whether it's a startup idea or an enterprise upgrade, we tailor strategies
        that work.
      </p>
      <p>
        We promise value-driven conversations, complete transparency, and solutions that deliver.
      </p>

      <footer className="mt-8 text-sm text-center text-gray-500">
        VOXA ASSIST © 2025
      </footer>
    </div>
  );
};

export default SiteContent;

import React, { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const sectionStyle = {
    display: 'flex',
    padding: '40px',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    color: '#000000',
    animation: 'fadeIn 1s ease-out',
  };

  const headingStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#4f46e5',
  };

  return (
    <div>
      {/* Section 1 */}
      <section style={sectionStyle}>
        <div style={{ flex: 1 }}>
          <h1 style={headingStyle}>Empowering Innovation Through Technology</h1>
          <p style={{ textAlign: 'justify' }}>            
            Welcome to our technology hub, where ideas meet innovation. We specialize in building custom digital 
            experiences for modern businesses. From secure web apps to AI-driven platforms, we help you scale with 
            confidence. We bring strategy, design, and engineering together under one roof. 
          </p>
        </div>
        <img
          src="https://i.pinimg.com/736x/4d/77/13/4d771383de42c87535f4e3d981edb4a0.jpg"
          alt="Tech"
          style={{ flex: 1, width: '100%', height: '400px', marginLeft: '20px', borderRadius: '10px' }}
        />
      </section>

      {/* Section 2 */}
      <section style={{ ...sectionStyle, flexDirection: 'row-reverse' }}>
        <div style={{ flex: 1 }}>
          <h2 style={headingStyle}>Delivering End-to-End Digital Solutions</h2>
          <p style={{ textAlign: 'justify' }}>
            Our services span across development, operations, security, AI/ML, and digital marketing. 
            With each project, we commit to excellence, speed, and measurable outcomes. 
            We adopt agile methods, cutting-edge tools, and best security practices to keep your systems resilient and users happy.
          </p>
        </div>
        <img
          src="https://i.pinimg.com/736x/5b/f2/3a/5bf23a2d0b01a76a471a1c99da81bc7f.jpg"
          alt="Services"
          style={{ flex: 1, width: '100%', height: '450px', marginRight: '20px', borderRadius: '10px' }}
        />
      </section>
    </div>
  );
};

export default Home;

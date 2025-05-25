import React, { useEffect } from "react";

const ContactUs = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes popIn {
        0% { transform: scale(0.9); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const styles = {
    container: {
      padding: '40px',
      textAlign: 'center',
      backgroundColor: '#ffffff',
      color: '#000',
      animation: 'popIn 1s ease-out',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    heading: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#4f46e5',
    },
    contactInfo: {
      marginTop: '30px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontSize: '1rem',
      lineHeight: '1.8',
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '6px 0',
    },
    icon: {
      color: '#4f46e5',
      marginRight: '8px',
    },
    button: {
      marginTop: '30px',
      padding: '12px 24px',
      backgroundColor: '#4f46e5',
      color: '#fff',
      fontSize: '1rem',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'transform 0.2s ease-in-out',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Let’s Collaborate and Build Something Amazing</h1>
      
      <p style={{ marginTop: '20px', maxWidth: '600px' }}>
        Have a project in mind? Need help scaling your tech stack? Book a call with our experts 
        and let's discuss how we can bring your vision to life. Whether it's a startup idea 
        or an enterprise upgrade, we tailor strategies that work.
      </p>
      
      <p style={{ marginTop: '10px', maxWidth: '600px' }}>
        We promise value-driven conversations, complete transparency, and solutions that deliver.
      </p>

      {/* Contact Info */}
      <div style={styles.contactInfo}>
        <div style={styles.infoItem}>
          <span style={styles.icon}>📞</span>
          <span><b>Phone:</b>&nbsp;+91 89405 13404</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.icon}>✉️</span>
          <span><b>Email:</b>&nbsp;sudhar@gmail.com</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.icon}>📍</span>
          <span><b>Address:</b>&nbsp;Salem</span>
        </div>
      </div>

      {/* Call Button */}
      <button
        style={styles.button}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        onClick={() => window.location.href = "tel:+918940513404"}
      >
        📞 Book a Free Call
      </button>
    </div>
  );
};

export default ContactUs;

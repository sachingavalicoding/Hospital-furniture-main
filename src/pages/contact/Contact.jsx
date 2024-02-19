// src/components/Footer.js
import { useRef } from "react";
import { FiInstagram, FiFacebook } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import SectionTitle from "../../components/ui/SectionTItle";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_7s5a9o8", "template_r6eb15x", form.current, {
        publicKey: "RGQYd5wnyDEl727DS",
      })
      .then(
        () => {
          alert(" MAIL SEND SUCCESSFULLY !");
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
    e.target.reset();
  };

  return (
    <section className="bg-gray-800  w-full text-slate-50 py-8">
      <SectionTitle
        title={"Contact us "}
        subtitle={"Connnet with me for any support "}
      />
      <div className="container mx-auto flex flex-col gap-14 text-slate-950 items-center justify-center">
        <form
          ref={form}
          onSubmit={sendEmail}
          className="mt-8  flex flex-col w-full px-8 gap-4 max-w-[28rem]"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="p-2 border border-gray-300 rounded-md mb-2 sm:mb-0"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="p-2 border border-gray-300 rounded-md mb-2 sm:mb-0"
            required
          />

          <textarea
            name="message"
            id="massage"
            placeholder="Your Message"
            className="w-full p-2 border border-gray-300 text-slate-900 rounded-md mt-2"
            rows="4"
            required
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
          >
            Send Email
          </button>
        </form>
        <div className="flex gap-8 text-white">
          <Link
            to="https://wa.me/9921113378"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp
              size={30}
              className="transition duration-300 transform hover:scale-110"
            />
          </Link>
          <Link
            to="https://www.instagram.com/shree_jagadamba_production/?igsh=ZHhpdmt6Mm1leWVp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiInstagram
              size={30}
              className="transition duration-300 transform hover:scale-110"
            />
          </Link>
          <Link
            to="https://www.facebook.com/people/Mayur-Wagh/pfbid02NpBK1EjKquVdGfkvH5V8oAuHAjrwjh88vBQ6CL5ujEeMMf5Hj28pfnABqv23howql/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiFacebook
              size={30}
              className="transition duration-300 transform hover:scale-110"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Contact;

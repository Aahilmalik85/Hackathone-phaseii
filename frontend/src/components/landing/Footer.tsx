'use client';

import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { fadeVariants } from "@/lib/animations";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-sky-700 bg-background-primary/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeVariants}
        >
          {/* Branding */}
          <div className="mb-6">
            <p className="text-lg font-bold text-sky-400 mb-2">
              Hackathon by Dil Awaiz Malik
            </p>
            <p className="text-sm text-sky-200 font-sans">
              GIAIC ID: 00052516
            </p>
          </div>

          {/* Divider */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-sky-500 to-transparent mx-auto mb-6" />

          {/* Social links */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-sky-300 hover:text-sky-400 hover:bg-background-secondary transition-all duration-200"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-sky-300 hover:text-sky-400 hover:bg-background-secondary transition-all duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:contact@example.com"
              className="p-2 rounded-lg text-sky-300 hover:text-sky-400 hover:bg-background-secondary transition-all duration-200"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-sky-200 font-sans">
            © {currentYear} Todo App. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

import './style.css';
console.log('Main JS Initializing, importing dependencies...');
import { portfolioData } from './data.js';
import { initInteractions } from './interactions.js';
import { initParticles } from './particles.js';
import { initCursor } from './cursor.js';


document.addEventListener('DOMContentLoaded', () => {
  addDynamicElements();
  renderContent();
  initInteractions();
  initParticles();
  initCursor();
  document.getElementById('year').textContent = new Date().getFullYear();
});


function addDynamicElements() {
  // Grain Overlay
  const grain = document.createElement('div');
  grain.className = 'grain-overlay';
  document.body.appendChild(grain);

  // Scroll Progress Bar
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress-container';
  progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
  document.body.prepend(progressBar);

  // Floating Shapes
  const shapesContainer = document.createElement('div');
  shapesContainer.className = 'floating-shapes-container';
  shapesContainer.innerHTML = `
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
    `;
  // Insert before the hero (or body start) but behind content thanks to z-index
  document.body.prepend(shapesContainer);
}

function renderContent() {
  // Hero Section
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.innerHTML = `
      <h1 class="hero-title reveal-text">${portfolioData.hero.name}</h1>
      <h2 class="hero-subtitle reveal-text delay-1 type-effect">${portfolioData.hero.title}</h2>
      <p class="hero-tagline reveal-text delay-2">${portfolioData.hero.tagline}</p>
      <a href="#work" class="btn reveal-text delay-3 glitched-btn magnetic">${portfolioData.hero.cta}</a>
    `;
  }

  // About Section
  const aboutContainer = document.querySelector('#about .container');
  if (aboutContainer) {
    const skillsHtml = portfolioData.about.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
    const statsHtml = portfolioData.about.stats ? portfolioData.about.stats.map(stat => `
        <div class="stat-item magnetic">
            <span class="stat-value">${stat.value}</span>
            <span class="stat-label">${stat.label}</span>
        </div>
    `).join('') : '';

    aboutContainer.innerHTML = `
      <div class="about-grid">
        <div class="about-text scroll-reveal">
          <h2 class="section-title">${portfolioData.about.title}</h2>
          <p>${portfolioData.about.description}</p>
          <div class="stats-row">${statsHtml}</div>
        </div>
        <div class="skills-wrapper scroll-reveal delay-1">
          <h3>Skills & Technologies</h3>
          <div class="skills-cloud">${skillsHtml}</div>
        </div>
      </div>
    `;
  }

  // Certifications
  if (portfolioData.certifications) {
    const certsHtml = portfolioData.certifications.map(cert => `
       <div class="cert-card scroll-reveal">
         <div class="cert-icon">🏆</div>
         <span>${cert}</span>
       </div>
     `).join('');

    const aboutSection = document.getElementById('about');
    let certContainer = document.querySelector('.certs-container');

    if (!certContainer && aboutSection) {
      certContainer = document.createElement('div');
      certContainer.className = 'container certs-container';
      aboutSection.appendChild(certContainer);
    }

    if (certContainer) {
      certContainer.innerHTML = `<h3 class="section-subtitle scroll-reveal">Certifications & Awards</h3><div class="certs-grid">${certsHtml}</div>`;
    }
  }

  // Experience Section
  const experienceList = document.getElementById('experience-list');
  if (experienceList) {
    experienceList.innerHTML = portfolioData.experience.map(job => `
      <div class="timeline-item scroll-reveal hover-3d">
        <span class="timeline-date">${job.period}</span>
        <div class="timeline-content">
          <h3>${job.role}</h3>
          <h4>${job.company}</h4>
          <p>${job.description}</p>
        </div>
      </div>
    `).join('');

    // Append Education if exists
    if (portfolioData.education) {
      const eduHtml = portfolioData.education.map(edu => `
          <div class="timeline-item scroll-reveal hover-3d">
            <span class="timeline-date">${edu.period}</span>
            <div class="timeline-content">
              <h3>${edu.degree}</h3>
              <h4>${edu.institution}</h4>
            </div>
          </div>
        `).join('');

      // Add a separator or title for education
      const eduContainer = document.createElement('div');
      eduContainer.innerHTML = `<h3 class="section-subtitle scroll-reveal" style="margin-top: 3rem;">Education</h3>${eduHtml}`;
      experienceList.parentNode.appendChild(eduContainer);
    }
  }

  // Projects Section
  const projectsGrid = document.getElementById('projects-grid');
  if (projectsGrid) {
    projectsGrid.innerHTML = portfolioData.projects.map(project => `
      <div class="project-card scroll-reveal spotlight-card">
        <div class="spotlight-overlay"></div>
        <div class="project-content">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-tech">
            ${project.tech.map(t => `<span>${t}</span>`).join('')}
          </div>
          <a href="${project.link}" class="project-link">View Project &rarr;</a>
        </div>
      </div>
    `).join('');
  }

  // Contact Section
  const contactContent = document.querySelector('.contact-content');
  if (contactContent) {
    contactContent.innerHTML = `
        <h2 class="section-title scroll-reveal">${portfolioData.contact.title}</h2>
        <p class="scroll-reveal delay-1">Interested in collaborating? Let's build something amazing.</p>
        <a href="mailto:${portfolioData.contact.email}" class="email-link scroll-reveal delay-2 magnetic">${portfolioData.contact.email}</a>
        <div class="social-links scroll-reveal delay-3">
            <a href="${portfolioData.contact.socials.github}" target="_blank" class="glass-btn magnetic">GitHub</a>
            <a href="${portfolioData.contact.socials.linkedin}" target="_blank" class="glass-btn magnetic">LinkedIn</a>
            <a href="${portfolioData.contact.socials.trailblazer}" target="_blank" class="glass-btn magnetic">Trailblazer</a>
        </div>
    `;
  }
}

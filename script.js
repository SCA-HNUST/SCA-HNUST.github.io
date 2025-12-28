document.addEventListener('DOMContentLoaded', function() {
    // Load profile information
    loadProfileInfo();

    // Load publications data
    loadPublications();

    // Load projects data
    loadProjects();

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');

    // 获取背景容器
    const starOverlay = document.querySelector('.header-bg-overlay');
    
    if (starOverlay) {
        // --- 动态生成恒星 ---
        const starCount = 10; 
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            
            star.className = 'twinkling-star'; 
            
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 2 + 1;
            const duration = Math.random() * 3 + 2; 
            const delay = Math.random() * 5;

            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            // 使用 CSS 中定义的动画名称 starFade
            star.style.animation = `starFade ${duration}s infinite alternate ${delay}s`;
            
            // 修复变量名，统一使用 starOverlay
            starOverlay.appendChild(star);
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only apply smooth scrolling to hash links (internal page links)
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Adjust the offset to account for the fixed navigation bar
                    const navHeight = document.querySelector('nav').offsetHeight;
                    window.scrollTo({
                        top: targetSection.offsetTop - navHeight - 20,
                        behavior: 'smooth'
                    });
                    
                    // Update active class
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        const navHeight = document.querySelector('nav').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - navHeight - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
});

// Function to load profile information
function loadProfileInfo() {
    let profileJsonPath = 'data/profile-info.json';
    let isSubpage = window.location.pathname.includes('/pages/');
    if (isSubpage) {
        profileJsonPath = '../data/profile-info.json';
    }

    // Get profile-info container
    const profileInfoContainer = document.querySelector('.profile-info');
    if (!profileInfoContainer) return;

    fetch(profileJsonPath)
        .then(response => response.json())
        .then(data => {
            // Clear existing content
            profileInfoContainer.innerHTML = '';
            
            // Add name
            const nameElement = document.createElement('h1');
            nameElement.innerHTML = data.name;
            profileInfoContainer.appendChild(nameElement);
            
            // Add subtitle
            const subtitleElement = document.createElement('p');
            subtitleElement.className = 'subtitle';
            subtitleElement.innerHTML = data.subtitle;
            profileInfoContainer.appendChild(subtitleElement);
            
            // Add social links container
            const contactInfo = document.createElement('div');
            contactInfo.className = 'contact-info';
            
            // Add each social link
            data.socialLinks.forEach(link => {
                const linkContainer = document.createElement('p');
                const anchor = document.createElement('a');
                // Adjust URL paths for subpages
                if (isSubpage && link.url.startsWith('assets/')) {
                    anchor.href = '../' + link.url;
                } else {
                    anchor.href = link.url;
                }
                
                if (link.target) {
                    anchor.target = link.target;
                }
                
                anchor.innerHTML = link.icon;
                linkContainer.appendChild(anchor);
                contactInfo.appendChild(linkContainer);
            });
            
            profileInfoContainer.appendChild(contactInfo);
            
            // Update profile image if there's a profile-image container
            const profileImageContainer = document.querySelector('.profile-image img');
            if (profileImageContainer && data.profileImage) {
                profileImageContainer.src = isSubpage ? 
                    '../' + data.profileImage : data.profileImage;
                profileImageContainer.alt = data.name;
            }
        })
        .catch(error => {
            console.error('Error loading profile information:', error);
        });
}


// Function to load publications from JSON
function loadPublications() {
    let publicationsJsonPath = 'data/publications.json';
    if (window.location.pathname.includes('/pages/')) {
        publicationsJsonPath = '../data/publications.json';
    }

    const publicationsList = document.querySelector('.publications-list');
    if (!publicationsList) return;
    
    // Clear existing publications
    publicationsList.innerHTML = '';
    
    fetch(publicationsJsonPath)
        .then(response => response.json())
        .then(publications => {
            // Sort publications by year (descending)
        //     publications.sort((a, b) => {
        //         return parseInt(b.year) - parseInt(a.year);
        //     }
        // )
        ;
            // Render all publications in a single list
            let counter = 1;
            publications.forEach(pub => {
                const pubElement = document.createElement('div');
                pubElement.className = 'publication accepted';
                
                // Store the original number as a data attribute for reference
                pubElement.dataset.originalNumber = counter;
                
                // Create venue/type label for left side
                const venueElement = document.createElement('div');
                venueElement.className = 'pub-venue-label';
                
                // Create publication number with a specific class for easy updates
                const numberElement = document.createElement('span');
                numberElement.className = 'pub-number';
                numberElement.textContent = counter++;
                venueElement.appendChild(numberElement);
                
                // Add venue text below the number
                const venueTextElement = document.createElement('span');
                venueTextElement.className = 'venue-text';
                venueTextElement.textContent = pub.venue;
                venueElement.appendChild(venueTextElement);
                
                // Create publication content container
                const contentElement = document.createElement('div');
                contentElement.className = 'pub-content';

                // Create main content wrapper
                const contentMainElement = document.createElement('div');
                contentMainElement.className = 'pub-content-main';

                // Create text content wrapper
                const contentTextElement = document.createElement('div');
                contentTextElement.className = 'pub-content-text';
                
                // Add title
                const titleElement = document.createElement('h3');
                titleElement.textContent = pub.title;
                contentTextElement.appendChild(titleElement);
                
                // Add authors
                const authorsElement = document.createElement('p');
                authorsElement.className = 'authors';
                authorsElement.textContent = pub.authors;
                contentTextElement.appendChild(authorsElement);
                
                // Add year
                const yearElement = document.createElement('p');
                yearElement.className = 'venue';
                yearElement.textContent = `Year: ${pub.year}`;
                contentTextElement.appendChild(yearElement);
                
                // Add tags
                const tagsContainer = document.createElement('div');
                tagsContainer.className = 'pub-tags';
                
                pub.tags.forEach(tag => {
                    if (tag.link) {
                        const tagLink = document.createElement('a');
                        tagLink.href = tag.link;
                        tagLink.className = `tag ${tag.class}`;
                        tagLink.textContent = tag.text;
                        tagLink.target = "_blank";
                        tagLink.rel = "noopener noreferrer";
                        tagsContainer.appendChild(tagLink);
                    } else {
                        const tagSpan = document.createElement('span');
                        tagSpan.className = `tag ${tag.class}`;
                        tagSpan.textContent = tag.text;
                        tagsContainer.appendChild(tagSpan);
                    }
                });

                // Add text content and tags to main content wrapper
                contentMainElement.appendChild(contentTextElement);
                contentMainElement.appendChild(tagsContainer);
                
                // Add main content wrapper to content element
                contentElement.appendChild(contentMainElement);
                
                // Combine elements and add to publications list
                pubElement.appendChild(venueElement);
                pubElement.appendChild(contentElement);
                publicationsList.appendChild(pubElement);
            });
        })
        .catch(error => {
            console.error('Error loading publications data:', error);
        });
}

// Function to load projects from JSON
function loadProjects() {
    let projectsJsonPath = 'data/projects.json';
    if (window.location.pathname.includes('/pages/')) {
        projectsJsonPath = '../data/projects.json';
    }

    const projectsList = document.querySelector('.projects-list');
    if (!projectsList) return;
    
    // Clear existing projects
    projectsList.innerHTML = '';
    
    fetch(projectsJsonPath)
        .then(response => response.json())
        .then(projects => {
            // Group projects by status
            const activeProjects = projects.filter(p => p.status === 'Ongoing');
            const completedProjects = projects.filter(p => p.status === 'Completed');
            
            // Add active projects section
            if (activeProjects.length > 0) {
                const activeTitle = document.createElement('h3');
                activeTitle.className = 'publication-section-title';
                activeTitle.textContent = 'Ongoing Projects';
                projectsList.appendChild(activeTitle);
                
                activeProjects.forEach(project => {
                    createProjectItem(project, projectsList);
                });
            }
            
            // Add completed projects section
            if (completedProjects.length > 0) {
                const completedTitle = document.createElement('h3');
                completedTitle.className = 'publication-section-title';
                completedTitle.textContent = 'Completed Projects';
                projectsList.appendChild(completedTitle);
                
                completedProjects.forEach(project => {
                    createProjectItem(project, projectsList);
                });
            }
        })
        .catch(error => {
            console.error('Error loading projects data:', error);
        });
}

// Function to create project item
function createProjectItem(project, container) {
    const projectElement = document.createElement('div');
    projectElement.className = 'news-item';
    
    // Create the date element
    const dateElement = document.createElement('div');
    dateElement.className = 'news-date';
    
    const dateHighlight = document.createElement('span');
    dateHighlight.className = 'year-highlight';
    dateHighlight.textContent = project.period;
    dateElement.appendChild(dateHighlight);
    
    // Create the content element
    const contentElement = document.createElement('div');
    contentElement.className = 'news-content';
    
    // Create the title element
    const titleElement = document.createElement('h3');
    titleElement.innerHTML = `<strong>${project.title}</strong> <span style="color: var(--primary-color); font-size: 0.9em;">(${project.type})</span>`;
    contentElement.appendChild(titleElement);
    
    // Create status badge
    const statusBadge = document.createElement('span');
    statusBadge.className = 'status-badge';
    statusBadge.textContent = project.status;
    statusBadge.style.cssText = `
        display: inline-block;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.8em;
        font-weight: 600;
        margin-left: 10px;
        background-color: ${project.status === 'Ongoing' ? '#4CAF50' : '#FF9800'};
        color: white;
    `;
    titleElement.appendChild(statusBadge);
    
    // Create the paragraph for description
    const paragraphElement = document.createElement('p');
    paragraphElement.textContent = project.description;
    contentElement.appendChild(paragraphElement);
    
    // Add date and content to the project item
    projectElement.appendChild(dateElement);
    projectElement.appendChild(contentElement);
    
    // Add the project item to the container
    container.appendChild(projectElement);
}
// initialization

const RESPONSIVE_WIDTH = 1024

let headerWhiteBg = false
let isHeaderCollapsed = window.innerWidth < RESPONSIVE_WIDTH
const collapseBtn = document.getElementById("collapse-btn")
const collapseHeaderItems = document.getElementById("collapsed-header-items")



function onHeaderClickOutside(e) {

    if (!collapseHeaderItems.contains(e.target)) {
        toggleHeader()
    }

}


function toggleHeader() {
    if (isHeaderCollapsed) {
        // collapseHeaderItems.classList.remove("max-md:tw-opacity-0")
        collapseHeaderItems.classList.add("opacity-100",)
        collapseHeaderItems.style.width = "60vw"
        collapseBtn.classList.remove("bi-list")
        collapseBtn.classList.add("bi-x", "max-lg:tw-fixed")
        isHeaderCollapsed = false

        setTimeout(() => window.addEventListener("click", onHeaderClickOutside), 1)

    } else {
        collapseHeaderItems.classList.remove("opacity-100")
        collapseHeaderItems.style.width = "0vw"
        collapseBtn.classList.remove("bi-x", "max-lg:tw-fixed")
        collapseBtn.classList.add("bi-list")
        isHeaderCollapsed = true
        window.removeEventListener("click", onHeaderClickOutside)

    }
}

function responsive() {
    if (window.innerWidth > RESPONSIVE_WIDTH) {
        collapseHeaderItems.style.width = ""

    } else {
        isHeaderCollapsed = true
    }
}

window.addEventListener("resize", responsive)


/**
 * Animations
 */

gsap.registerPlugin(ScrollTrigger)


gsap.to(".reveal-up", {
    opacity: 0,
    y: "100%",
})

// gsap.to("#dashboard", {
//     boxShadow: "0px 15px 25px -5px #7e22ceaa",
//     duration: 0.3,
//     scrollTrigger: {
//         trigger: "#hero-section",
//         start: "60% 60%",
//         end: "80% 80%",
//         // markers: true
//     }

// })

// straightens the slanting image
gsap.to("#dashboard", {

    scale: 1,
    translateY: 0,
    // translateY: "0%",
    rotateX: "0deg",
    scrollTrigger: {
        trigger: "#hero-section",
        start: "top 80%",
        end: "bottom bottom",
        scrub: 1,
        // markers: true,
    }

})

const faqAccordion = document.querySelectorAll('.faq-accordion')

faqAccordion.forEach(function (btn) {
    btn.addEventListener('click', function () {
        this.classList.toggle('active')

        // Toggle 'rotate' class to rotate the arrow
        let content = this.nextElementSibling
        
        // content.classList.toggle('!tw-hidden')
        if (content.style.maxHeight === '200px') {
            content.style.maxHeight = '0px'
            content.style.padding = '0px 18px'

        } else {
            content.style.maxHeight = '200px'
            content.style.padding = '20px 18px'
        }
    })
})



// ------------- reveal section animations ---------------

const sections = gsap.utils.toArray("section")

sections.forEach((sec) => {

    const revealUptimeline = gsap.timeline({paused: true, 
                                            scrollTrigger: {
                                                            trigger: sec,
                                                            start: "10% 80%", // top of trigger hits the top of viewport
                                                            end: "20% 90%",
                                                            // markers: true,
                                                            // scrub: 1,
                                                        }})

    revealUptimeline.to(sec.querySelectorAll(".reveal-up"), {
        opacity: 1,
        duration: 0.8,
        y: "0%",
        stagger: 0.2,
    })


})

// ------------- Email Form Submission ---------------

// Simple email submission to Google Form
function handleEmailSubmission() {
    const emailInput = document.getElementById('email-input');
    const email = emailInput.value;
    
    // Create hidden iframe for silent submission
    let iframe = document.getElementById('hidden-iframe');
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'hidden-iframe';
        iframe.name = 'hidden-iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }
    
    // Create a form that submits to Google Form
    const form = document.createElement('form');
    form.action = 'https://docs.google.com/forms/d/e/1FAIpQLScWvLu6qzWk_Gecgjoju2_dQ6QU_J9pFW3WFrUYMPsps7fLNA/formResponse';
    form.method = 'POST';
    form.target = 'hidden-iframe';
    form.style.display = 'none';
    
    // Add the email field (replace with actual entry ID from your Google Form)
    const emailField = document.createElement('input');
    emailField.type = 'hidden';
    emailField.name = 'entry.182849506'; // Replace with actual entry ID
    emailField.value = email;
    form.appendChild(emailField);
    
    // Submit the form
    document.body.appendChild(form);
    form.submit();
    
    // Hide the input field and button
    const formContainer = emailInput.closest('.tw-flex');
    const submitBtn = document.getElementById('email-submit-btn');
    
    formContainer.style.display = 'none';
    
    // Create and show thank you message
    const thankYouMessage = document.createElement('div');
    thankYouMessage.textContent = 'Thank you for joining. We will be in touch soon.';
    thankYouMessage.style.color = '#10b981';
    thankYouMessage.style.fontSize = '1.2rem';
    thankYouMessage.style.fontWeight = '500';
    thankYouMessage.style.textAlign = 'center';
    thankYouMessage.style.padding = '20px';
    
    // Insert the message after the form container
    formContainer.parentNode.insertBefore(thankYouMessage, formContainer.nextSibling);
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(form);
    }, 1000);
}

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('email-submit-btn');
    const emailInput = document.getElementById('email-input');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', handleEmailSubmission);
    }
    
    if (emailInput) {
        emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleEmailSubmission();
            }
        });
    }
});
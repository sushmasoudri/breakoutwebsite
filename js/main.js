(function(){
	const toggle = document.querySelector('.nav__toggle');
	const links = document.querySelector('.nav__links');
	if(toggle && links){
		toggle.addEventListener('click', ()=>{
			links.classList.toggle('is-open');
		});
	}

	// Smooth scroll for internal anchors
	document.addEventListener('click', (e)=>{
		const target = e.target;
		if(target instanceof HTMLElement){
			const anchor = target.closest('a[href^="#"]');
			if(anchor){
				e.preventDefault();
				const id = anchor.getAttribute('href').slice(1);
				const el = document.getElementById(id);
				if(el){ el.scrollIntoView({behavior:'smooth', block:'start'}); }
			}
		}
	});

	// Scroll reveal
	const revealEls = document.querySelectorAll('.reveal, .card, .section__title');
	if('IntersectionObserver' in window && revealEls.length){
		const io = new IntersectionObserver((entries)=>{
			entries.forEach((entry)=>{
				if(entry.isIntersecting){
					entry.target.classList.add('is-visible');
					io.unobserve(entry.target);
				}
			});
		},{threshold:0.12, rootMargin:'0px 0px -40px 0px'});
		revealEls.forEach((el)=> io.observe(el));
	}else{
		revealEls.forEach((el)=> el.classList.add('is-visible'));
	}

	// Video Carousel for Homepage
	const videoCarousel = document.querySelector('.video-carousel');
	if(videoCarousel){
		const videos = videoCarousel.querySelectorAll('.hero__video');
		let currentVideoIndex = 0;
		
		function playNextVideo(){
			// Hide current video
			videos[currentVideoIndex].classList.remove('active');
			videos[currentVideoIndex].pause();
			
			// Move to next video
			currentVideoIndex = (currentVideoIndex + 1) % videos.length;
			
			// Show and play next video
			const nextVideo = videos[currentVideoIndex];
			nextVideo.classList.add('active');
			nextVideo.currentTime = 0; // Reset to beginning
			nextVideo.play().catch(e => console.log('Video autoplay prevented:', e));
		}
		
		// Set up video event listeners
		videos.forEach((video, index) => {
			video.addEventListener('ended', () => {
				// When a video ends, play the next one
				setTimeout(playNextVideo, 1000); // 1 second pause between videos
			});
			
			video.addEventListener('loadeddata', () => {
				// Ensure first video plays automatically
				if(index === 0){
					video.play().catch(e => console.log('Video autoplay prevented:', e));
				}
			});
		});
		
		// Start the carousel
		if(videos.length > 0){
			// Set initial video
			videos[0].classList.add('active');
		}
	}

	// Optional: Intercept form submit to show a quick confirmation on success
	const leadForm = document.getElementById('lead-form');
	if(leadForm){
		leadForm.addEventListener('submit', async (e)=>{
			// Let native HTML validation run first
			if(!leadForm.checkValidity()) return;
			// Allow normal submit to Formspree; also show a quick feedback
			setTimeout(()=>{
				const note = document.createElement('p');
				note.textContent = 'Thanks — your inquiry has been sent.';
				note.className = 'muted';
				leadForm.appendChild(note);
			}, 400);
		});
	}
})();

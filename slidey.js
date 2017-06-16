
// Put all the functions in an object to prevent clutter and conflicts
var slideyFunctions = {
    onDOMReady: function() {
        // Fetch a list of all slideshow containers
        var slideyContainers = document.querySelectorAll(".slidey-container");

        // For every slideshow container
        for (var i = 0; i < slideyContainers.length; i++) {
            // For every child
            for (var j = 0; j < slideyContainers[i].children.length; j++) {
                
                // Assign the prev/next slide buttons
                if (slideyContainers[i].children[j].classList.contains("slidey-adjacent")) {
                    for (var k = 0; k < slideyContainers[i].children[j].children.length; k++) {
                        if (slideyContainers[i].children[j].children[k].classList.contains("slidey-prev"))
                            slideyContainers[i].children[j].children[k].onclick = slideyFunctions.onPrevSlide;
                        if (slideyContainers[i].children[j].children[k].classList.contains("slidey-next"))
                            slideyContainers[i].children[j].children[k].onclick = slideyFunctions.onNextSlide;
                    }
                }

                // Create and assign the individual slide buttons
                if (slideyContainers[i].children[j].classList.contains("slidey-slide")) {
                    // Create an element
                    var slideBtn = document.createElement("a");
                    slideBtn.setAttribute("href", "#");
                    slideBtn.setAttribute("data-slidey-slide", j + 1);
                    if (slideyContainers[i].children[j].classList.contains("slidey-active"))
                        slideBtn.classList.add("slidey-active");
                    slideBtn.onclick = slideyFunctions.onSelectSlide;

                    // Attach it to the UI
                    for (var k = 0; k < slideyContainers[i].children.length; k++) {
                        if (slideyContainers[i].children[k].classList.contains("slidey-select")) {
                            slideyContainers[i].children[k].appendChild(slideBtn);
                        }
                    }
                }
            }
        }
    },
    onNextSlide: function() {
        slideyFunctions.setSlide(this.parentElement.parentElement, slideyFunctions.getSlide(this.parentElement.parentElement) + 1);
        return false;
    },
    onPrevSlide: function() {
        slideyFunctions.setSlide(this.parentElement.parentElement, slideyFunctions.getSlide(this.parentElement.parentElement) - 1);
        return false;
    },
    onSelectSlide: function() {
        // console.log(parseInt(this.getAttribute("data-slidey-slide")));
        slideyFunctions.setSlide(this.parentElement.parentElement, parseInt(this.getAttribute("data-slidey-slide")));
        return false;
    },
    getSlide: function(slideyContainer) {
        // Check and respond with the active slide
        for (var i = 0; i < slideyContainer.children.length; i++) {
            if (slideyContainer.children[i].classList.contains("slidey-active"))
                return i + 1;
        }
    },
    setSlide: function(slideyContainer, slide) {
        if (typeof slideyContainer !== "object" || typeof slide !== "number")
            throw("Arguments invalid\n" + 
                  "setSlide(slideyContainer, slide)\n" +
                  "  slideyContainer: HTML element\n" +
                  "  slide:           Integers\n\n" + 
                  "Usage: setSlide(document.querySelectorAll(\".slidey-container\")[0], 2)\n" + 
                  "  Shows the second slide on the first slideshow");

        // Remove all slides and count them up
        var slideCount = 0;
        for (var i = 0; i < slideyContainer.children.length; i++) {
            if (slideyContainer.children[i].classList.contains("slidey-slide")) {
                slideyContainer.children[i].classList.remove("slidey-active");
                slideyContainer.children[i].classList.remove("slidey-prev");
                slideyContainer.children[i].classList.remove("slidey-next");
                slideCount++;
            }
        }

        // Prevent going out of bounds
        if (slide > slideCount) slide = 1;
        if (slide < 1)          slide = slideCount;

        // Calculate the elements which will have the reference points
        var refPnt = {
            prev: (slide < 2) ? slideCount : slide - 1,
            now:  slide,
            next: (slide > slideCount - 1) ? 1 : slide + 1
        }

        // Add the reference points for the previous and next slide
        for (var i = 0; i < slideyContainer.children.length; i++) {
            if (slideyContainer.children[i].classList.contains("slidey-slide")) {    
                if (i == refPnt.prev - 1)
                    slideyContainer.children[i].classList.add("slidey-prev");
                if (i == refPnt.now  - 1)
                    slideyContainer.children[i].classList.add("slidey-active");
                if (i == refPnt.next - 1)
                    slideyContainer.children[i].classList.add("slidey-next");
            }
        }

        // Also update the dots
        for (var i = 0; i < slideyContainer.children.length; i++)
            if (slideyContainer.children[i].classList.contains("slidey-select"))
                for (var j = 0; j < slideyContainer.children[i].children.length; j++) {
                    slideyContainer.children[i].children[j].classList.remove("slidey-active");
                    if (slideyContainer.children[i].children[j].getAttribute("data-slidey-slide") == refPnt.now)
                        // console.log(slideyContainer.children[i].children[j]);
                        slideyContainer.children[i].children[j].classList.add("slidey-active");
                }
    }
}

// Hook the DOM ready function
document.addEventListener("DOMContentLoaded", slideyFunctions.onDOMReady);

"use strict";

function homeProducts() {
	var variantInfos = document.querySelectorAll(".c-home-product__info__variant"),
		productImages = document.querySelectorAll(".c-home-product__image");
	variantInfos && productImages && variantInfos.forEach(function(variantInfo) {
		variantInfo.addEventListener("click", function(e) {
			var variantId = e.currentTarget.dataset.variantId,
				productId = e.currentTarget.dataset.productId,
				otherVariants = e.currentTarget.parentElement.querySelectorAll(".c-home-product__info__variant");
			otherVariants && (otherVariants.forEach(function(variantInfoItem) {
				variantInfoItem.classList.remove("c-home-product__info__variant--active")
			}), e.currentTarget.classList.add("c-home-product__info__variant--active")), variantId && productId && productImages.forEach(function(productImage) {
				var productImageId = productImage.dataset.productId;
				if (productImageId && productImageId === productId) {
					var productImageVariants = productImage.querySelector(".c-home-product__image__product__variants");
					if (productImageVariants) {
						if (productImageVariants.childNodes.length === 0) return;
						productImage.classList.contains("show-variant") || productImage.classList.add("show-variant");
						var variantImages = productImage.querySelectorAll(".c-home-product__image__primary--variant");
						variantImages && variantImages.forEach(function(variantImage) {
							var variantImageId = variantImage.dataset.variantId;
							variantImageId && (variantImageId === variantId ? variantImage.classList.add("show-variant-image") : variantImage.classList.remove("show-variant-image"))
						})
					}
				}
			}), window.innerWidth > 1199 ? e.preventDefault() : window.location.href = e.currentTarget.attr("href")
		})
	});
	var reviewsCounters = document.querySelectorAll(".c-home-product__rating--js");
	reviewsCounters && reviewsCounters.forEach(function(reviewsCounter) {
		var api = reviewsCounter.dataset.publicApi,
			reviewProduct = reviewsCounter.dataset.productId,
			domain = reviewsCounter.dataset.domain;
		if (!(!api || !reviewProduct || !domain)) {
			var requestOptions = {
				method: "GET",
				redirect: "follow"
			};
			fetch("http://stamped.io/api/widget/reviews?productId=" + reviewProduct + "&minRating=1&storeUrl=" + domain + "&apiKey=" + api, requestOptions).then(function(response) {
				return response.json()
			}).then(function(results) {
				reviewsCounter.classList.remove("c-home-product__rating--hidden");
				var ratingInfo = reviewsCounter.querySelector(".c-home-product__rating__info"),
					ratingStar = reviewsCounter.querySelector(".c-home-product__rating__star");
				ratingStar.style.setProperty("--rating", results.rating), ratingStar.style.setProperty("--rating-max", 5), ratingStar.style.setProperty("--rating-decimal", .5);
				var reviewText = " Review";
				results.total > 1 && (reviewText = " Reviews"), ratingInfo.innerHTML = results.total + reviewText
			}).catch(function(error) {
				reviewsCounter.classList.add("c-home-product__rating--hidden")
			})
		}
	})
}
homeProducts(), window.addEventListener("resize", homeProducts);
//# sourceMappingURL=/s/files/1/0071/9755/6794/t/24/assets/home-products.js.map?v=1675308730
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('productScrollContainer');
    const leftBtn = container.parentElement.querySelector('.scroll-arrow.left');
    const rightBtn = container.parentElement.querySelector('.scroll-arrow.right');

    const card = container.querySelector('.collection-card');
    if (!card) return; // no cards

    const gap = 16; // gap in px (matches CSS)

    function updateButtons() {
      leftBtn.disabled = container.scrollLeft <= 0;
      rightBtn.disabled = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
    }

    function scrollLeft() {
      const cardWidth = card.offsetWidth + gap;
      container.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }

    function scrollRight() {
      const cardWidth = card.offsetWidth + gap;
      container.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }

    leftBtn.addEventListener('click', function() {
      scrollLeft();
    });

    rightBtn.addEventListener('click', function() {
      scrollRight();
    });

    container.addEventListener('scroll', updateButtons);

    // Initial check
    updateButtons();
  });
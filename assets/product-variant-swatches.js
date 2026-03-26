"use strict";

function product() {
  var productGallerySlider = document.querySelector(".c-product__slider");
  var gallerySlider = null;
  if (productGallerySlider) {
    gallerySlider = new Swiper(productGallerySlider, {
      navigation: {
        prevEl: ".c-product__slider__nav--prev",
        nextEl: ".c-product__slider__nav--next"
      },
      on: {
        slideChange: function slideChange(e) {
          var currentIndex = e.activeIndex;
          var bgVideoEl = e.slides[currentIndex].querySelector(".jarallax-mobile");
          if (bgVideoEl) {
            jarallaxVideo();
            var videoUrl = bgVideoEl.dataset.src;
            if (videoUrl) {
              jarallax(bgVideoEl, {
                speed: 1,
                videoSrc: videoUrl,
                videoPlayOnlyVisible: false,
                videoLazyLoading: false,
                onVideoWorkerInit: function onVideoWorkerInit(videoObject) {
                  if (videoObject.isValid()) {
                    videoObject.on("started", function (event) {
                      var parent = event.target.g.parentNode;
                      parent.classList.add("show-video");
                    });
                  }
                }
              });
            }
          }
        },
        init: calculatePaddingtop
      }
    });
  }
  var reviewsCounter = document.querySelector(".c-product__rating--js");
  if (reviewsCounter) {
    var api = reviewsCounter.dataset.publicApi;
    var reviewProduct = reviewsCounter.dataset.productId;
    var domain = reviewsCounter.dataset.domain;
    if (!api || !reviewProduct || !domain) {
      return;
    }
    var requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch("http://stamped.io/api/widget/reviews?productId=" + reviewProduct + "&minRating=1&storeUrl=" + domain + "&apiKey=" + api, requestOptions).then(function (response) {
      return response.json();
    }).then(function (results) {
      reviewsCounter.classList.remove("c-product__rating--hidden");
      var ratingInfo = reviewsCounter.querySelector(".c-product__rating__info");
      var ratingStar = reviewsCounter.querySelector(".c-product__rating__star");
      ratingStar.style.setProperty("--rating", results.rating);
      ratingStar.style.setProperty("--rating-max", 5);
      ratingStar.style.setProperty("--rating-decimal", 0.5);
      var reviewText = " Review";
      if (results.total > 1) {
        reviewText = " Reviews";
      }
      ratingInfo.innerHTML = results.total + reviewText;
    }).catch(function (error) {
      reviewsCounter.classList.add("c-product__rating--hidden");
    });
  }
  // Quantity.
  var qtyWrapper = document.querySelector(".c-product__form__quantity__wrapper");
  if (qtyWrapper) {
    var minus = qtyWrapper.querySelector(".c-product__form__quantity__minus");
    var plus = qtyWrapper.querySelector(".c-product__form__quantity__plus");
    var input = qtyWrapper.querySelector("input");
    if (input) {
      if (plus) {
        plus.addEventListener("click", function () {
          input.value++;
        });
      }
      if (minus) {
        minus.addEventListener("click", function () {
          if (input.value > 1) {
            input.value--;
          }
        });
      }
    }
  }

  // Range.
  var range = document.querySelector(".c-product__umf__range");
  var umfList = document.querySelectorAll(".c-product__umf__nav__item");
  if (range && umfList) {
    range.addEventListener("input", function (e) {
      umfList.forEach(function (umfItem, index) {
        if (Number(e.currentTarget.value) === index + 1) {
          umfItem.classList.add("is-active");
        } else {
          umfItem.classList.remove("is-active");
        }
      });
    });
    range.addEventListener("change", function (e) {
      umfList.forEach(function (umfItem, index) {
        if (Number(e.currentTarget.value) === index + 1) {
          umfItem.classList.add("is-active");
        } else {
          umfItem.classList.remove("is-active");
        }
      });
    });
  }
  var variantsInputWrapper = document.querySelector(".c-product__form__variants");
  var productImageVariants = document.querySelectorAll(".c-product__image__variants");
  var productImageWrapper = document.querySelectorAll(".c-product__image__wrapper");
  if (variantsInputWrapper && variantsInputWrapper && productImageWrapper) {
    // var radioInputs = variantsInputWrapper.querySelectorAll('input[type="radio"]');
    var selectInput = variantsInputWrapper.querySelector("select");
    var radioInputs = variantsInputWrapper.querySelectorAll('.product-form__option-element');
    if (radioInputs) {
      radioInputs.forEach(function (radioInput) {
        radioInput.addEventListener("click", function (e) {
          var variantId = e.currentTarget.dataset.id;
          if (variantId) {
            productImageVariants.forEach(function (productImageVariantItem) {
              if (productImageVariantItem.childNodes.length === 0) {
                return;
              } else {
                productImageWrapper.forEach(function (productImageWrapperItem) {
                  if (!productImageWrapperItem.classList.contains("show-variant")) {
                    productImageWrapperItem.classList.add("show-variant");
                  }
                  var productVariantImages = productImageVariantItem.querySelectorAll(".c-product__image__variant");
                  if (productVariantImages) {
                    productVariantImages.forEach(function (variantImage) {
                      var variantImageId = variantImage.dataset.variantId;
                      if (variantImageId) {
                        if (variantImageId === variantId) {
                          variantImage.classList.add("show-variant-image");
                          if (gallerySlider) {
                            gallerySlider.slideTo(0);
                          }
                        } else {
                          variantImage.classList.remove("show-variant-image");
                        }
                      }
                    });
                  }
                });
              }
            });
          }
        });
        radioInput.addEventListener("change", function (e) {
          selectInput.value = e.currentTarget.value;
        });
      });
      selectInput?.addEventListener("change", function (e) {
        radioInputs.forEach(function (radioInput) {
          if (e.currentTarget.value === radioInput.value) {
            radioInput.checked = true;
          } else {
            radioInput.removeAttribute("checked");
          }
          if (gallerySlider !== null) {
            gallerySlider.slideTo(0);
          }
          var variantId = e.currentTarget.value;
          if (variantId) {
            productImageVariants.forEach(function (productImageVariantItem) {
              if (productImageVariantItem.childNodes.length === 0) {
                return;
              } else {
                productImageWrapper.forEach(function (productImageWrapperItem) {
                  if (!productImageWrapperItem.classList.contains("show-variant")) {
                    productImageWrapperItem.classList.add("show-variant");
                  }
                  var productVariantImages = productImageVariantItem.querySelectorAll(".c-product__image__variant");
                  if (productVariantImages) {
                    productVariantImages.forEach(function (variantImage) {
                      var variantImageId = variantImage.dataset.variantId;
                      if (variantImageId) {
                        if (variantImageId === variantId) {
                          variantImage.classList.add("show-variant-image");
                          if (gallerySlider) {
                            gallerySlider.slideTo(0);
                          }
                        } else {
                          variantImage.classList.remove("show-variant-image");
                        }
                      }
                    });
                  }
                });
              }
            });
          }
        });
      });
    }
  }
  var backgroundVideo = document.querySelector(".jarallax-desktop");
  if (backgroundVideo) {
    jarallaxVideo();
    var videoUrl = backgroundVideo.dataset.src;
    if (videoUrl) {
      jarallax(backgroundVideo, {
        speed: 1,
        videoSrc: videoUrl,
        videoStartTime: 10,
        videoPlayOnlyVisible: true,
        videoLazyLoading: true,
        onVideoWorkerInit: function onVideoWorkerInit(videoObject) {
          videoObject.getVideo(function (video) {
            video.parentNode.classList.add("is-video-hidden");
          });
          videoObject.on("started", function () {
            setTimeout(function () {
              videoObject.getVideo(function (video) {
                video.parentNode.classList.remove("is-video-hidden");
              });
            }, 500);
          });
          backgroundVideo.addEventListener("mouseenter", function (e) {
            videoObject.pause();
          });
          backgroundVideo.addEventListener("mouseleave", function (e) {
            videoObject.play();
          });
        }
      });
    }
  }
  var productContent = document.querySelector(".c-manuka-features");
  var header = document.querySelector(".c-header");
  var productBar = document.querySelector(".c-product__bar");
  gsap.registerPlugin("ScrollTrigger");
  if (productContent && productBar) {
    ScrollTrigger.create({
      trigger: productContent,
      onLeave: function onLeave() {
        productBar.classList.add("c-product__bar--visible");
        if (header) {
          header.classList.add("hide-sticky");
        }
      },
      onEnterBack: function onEnterBack() {
        productBar.classList.remove("c-product__bar--visible");
        if (header) {
          header.classList.remove("hide-sticky");
        }
      }
    });
  }
  var productBarButtons = document.querySelectorAll(".c-product__bar__button");
  var productForm = document.querySelector(".c-product__form");
  var addToCartbutton = productForm.querySelector(".c-product__form__cart");
  if (productBarButtons && productForm) {
    productBarButtons.forEach(function (productBarButton) {
      document.addEventListener("submit", function (e) {
        if ("liquidAjaxCart" in window) {
          e.preventDefault();
        }
      });
      productBarButton.addEventListener("click", function (e) {
        e.preventDefault();
        if (addToCartbutton) {
          console.log("click");
          addToCartbutton.click();
        }
      });
    });
  }
  if (productForm) {
    productForm.addEventListener("submit", function (e) {
      if ("liquidAjaxCart" in window) {
        e.preventDefault();
      }
    });
  }

  // Check that Liquid Ajax Cart exists
  if ("liquidAjaxCart" in window) {
    // Define a callback for all the Cart Ajax API requests
    // It will be called BEFORE each request is getting performed
    liquidAjaxCart.subscribeToCartAjaxRequests(function (requestState, subscribeToResult) {
      // If the request is 'Add to cart'
      if (requestState.requestType === "add") {
        sideCart();
        // Define a callback that will be called after the request is finished
        subscribeToResult(function (requestState) {
          var _requestState$respons;
          // If the request is successful
          if ((_requestState$respons = requestState.responseData) !== null && _requestState$respons !== void 0 && _requestState$respons.ok) {
            sideCart();
            document.body.classList.add("js-side-cart-open");
          }
        });
      }
    });
  }
}
product();
window.addEventListener("load", function (event) {
  var rcInputs = document.querySelectorAll(".rc-radio__input");
  var price = document.querySelector(".c-product__afterpay__price");
  var activePlan = document.querySelector(".rc-radio--active");
  
  if (activePlan && price && rcInputs) {
    var currentPrice = activePlan.querySelector(".price-label").innerHTML.match(/\d+(?:\.\d+)?/g);
    if (currentPrice) {
      price.innerHTML = currentPrice;
    }
    rcInputs.forEach(function (rcInput) {
      rcInput.addEventListener("click", function (e) {
        activePlan = e.currentTarget.parentNode;
        price.innerHTML = e.currentTarget.nextSibling.querySelector(".price-label").innerHTML.match(/\d+(?:\.\d+)?/g);
      });
    });
  }
  
  var variantRadios = document.querySelectorAll(".c-product__form__radio");
  if (variantRadios) {
    variantRadios.forEach(function (variantRadio) {
      var input = variantRadio.querySelector("input");
      input.addEventListener("click", function (e) {
        if (activePlan.classList.contains("onetime-radio")) {
          if (productObject) {
            productObject.variants.forEach(function (variant) {
              if (variant.id == e.currentTarget.value) {
                price.innerHTML = variant.price / 100;
                history.replaceState({}, '', `${location.pathname}?variant=${variant.id}`);
              }
            });
          }
        } else {
          if (productObject) {
            productObject.variants.forEach(function (variant) {
              if (variant.id == e.currentTarget.value) {
                price.innerHTML = variant.selling_plan_allocations[0].price / 100;
                history.replaceState({}, '', `${location.pathname}?variant=${variant.id}`);
              }
            });
          }
        }
      });
    });
  }
  
  var variantSelect = document.querySelector(".c-product__form__select");
  if (variantSelect) {
    variantSelect.addEventListener("change", function (e) {
      variantSelect.classList.add("is-selected");
      if (activePlan.classList.contains("onetime-radio")) {
        if (productObject) {
          productObject.variants.forEach(function (variant) {
            if (variant.id == e.currentTarget.value) {
              price.innerHTML = variant.price / 100;
              history.replaceState({}, '', `${location.pathname}?variant=${variant.id}`);
            }
          });
        }
      } else {
        if (productObject) {
          productObject.variants.forEach(function (variant) {
            if (variant.id == e.currentTarget.value) {
              price.innerHTML = variant.selling_plan_allocations[0].price / 100;
              history.replaceState({}, '', `${location.pathname}?variant=${variant.id}`);
            }
          });
        }
      }
    });
  }

  var edt = document.querySelector("#edt-p");
  if (edt) {
    var edtSplited = edt.innerHTML.split(":");
    var edtNew = edtSplited[0] + ":</p><p>" + edtSplited[1]?.trim();
    edt.innerHTML = edtNew;
    var edtDefault = document.querySelector(".c-product__form__estimated");
    if (edtDefault) {
      edtDefault.innerHTML = edtNew;
    }
    var edtMobile = document.querySelector(".c-product__form__estimated--mobile");
    if (edtMobile) {
      edtMobile.innerHTML = edtNew;
    }
  }

  var stampedMainWidget = document.querySelector("#stamped-main-widget");
  var productContent = document.querySelector(".c-product__content");
  if (stampedMainWidget && productContent) {
    stampedMainWidget.setAttribute("style", "--product-color:" + productContent.dataset.productColor);
  }
});

function calculatePaddingtop() {
  var slider = document.querySelector(".c-product__slider");
  var info = document.querySelector(".c-product__info-top");
  if (slider && info) {
    if (window.innerWidth > 991) {
      console.log(slider.offsetHeight - 24, info.offsetHeight);
      slider.offsetHeight - 24 > info.offsetHeight ? info.setAttribute("style", "--pb: calc(" + (slider.offsetHeight - info.offsetHeight) + "px - 2.5rem)") : info.setAttribute("style", "--pb: 0px");
    } else {
      info.setAttribute('style', '--pb: 0px');
    }
  }
}
window.addEventListener("resize", calculatePaddingtop);
"use strict";

function stampedReviews() {
  var el = document.querySelector('.c-reviews--stamped');
  if (!el) {
    return;
  }
  el.classList.add('c-reviews--loading');
  var publieAPI = el.dataset.api;
  if (!publieAPI) {
    return;
  }
  var domain = el.dataset.domain;
  if (!domain) {
    return;
  }
  var min = '4';
  if (el.dataset.min) {
    min = el.dataset.min;
  }
  var type = 'all';
  if (el.dataset.type) {
    type = el.dataset.type;
  }
  var product = null;
  if (el.dataset.productId) {
    product = el.dataset.productId;
  }

  //domain = '" + domain + "'

  var ratingStar = document.querySelector('.c-review__rating__svg');
  var infos = document.querySelectorAll('.c-review__hidden__info');
  var loadMore = document.querySelector('.c-reviews__loadmore');
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  var reviewsRow = el.querySelector('.c-reviews__row');
  var page = 1;
  var sortValue = '';
  var sort = document.querySelector('#reviewsSort');
  sort.disabled = true;
  var url = "http://stamped.io/api/widget/reviews?minRating=" + min + "&take=3&page=" + page + "&storeUrl=" + domain + "&apiKey=" + publieAPI + "&sortReviews=" + sortValue;
  if (type == 'current' && product) {
    url = "http://stamped.io/api/widget/reviews?productId=" + product + "&minRating=" + min + "&take=3&page=" + page + "&storeUrl=" + domain + "&apiKey=" + publieAPI + "&sortReviews=" + sortValue;
  }
  if (sort) {
    sort.addEventListener('change', function (event) {
      reviewsRow.innerHTML = '';
      el.classList.add('c-reviews--loading');
      loadMore.classList.remove('c-reviews__loadmore--loading');
      loadMore.classList.remove('c-reviews__loadmore--hidden');
      loadMore.innerHTML = 'Load More';
      sortValue = event.currentTarget.value;
      page = 1;
      url = "http://stamped.io/api/widget/reviews?minRating=" + min + "&take=3&page=" + page + "&storeUrl=" + domain + "&apiKey=" + publieAPI + "&sortReviews=" + sortValue;
      if (type == 'current' && product) {
        url = "http://stamped.io/api/widget/reviews?productId=" + product + "&minRating=" + min + "&take=3&page=" + page + "&storeUrl=" + domain + "&apiKey=" + publieAPI + "&sortReviews=" + sortValue;
      }
      createReviews(el, sort, infos, ratingStar, reviewsRow, loadMore, url, requestOptions);
    });
  }
  if (loadMore) {
    loadMore.addEventListener('click', function (e) {
      e.preventDefault();
      page = page + 1;
      url = "http://stamped.io/api/widget/reviews?minRating=" + min + "&take=3&page=" + page + "&storeUrl=" + domain + "&apiKey=" + publieAPI + "&sortReviews=" + sortValue;
      if (type == 'current' && product) {
        url = "http://stamped.io/api/widget/reviews?productId=" + product + "&minRating=" + min + "&take=3&page=" + page + "&storeUrl=" + domain + "&apiKey=" + publieAPI + "&sortReviews=" + sortValue;
      }
      e.currentTarget.innerText = "Loading...";
      createReviews(el, sort, infos, ratingStar, reviewsRow, loadMore, url, requestOptions);
    });
  }
  createReviews(el, sort, infos, ratingStar, reviewsRow, loadMore, url, requestOptions);
}
function createReviews(el, sort, infos, ratingStar, reviewsRow, loadMore, url, requestOptions) {
  fetch(url, requestOptions).then(function (response) {
    return response.json();
  }).then(function (results) {
    el.classList.remove('c-reviews--loading');
    sort.disabled = false;
    var counter = 0;
    if (results.total <= 3) {
      loadMore.classList.add('c-reviews__loadmore--hidden');
    } else {
      loadMore.classList.remove('c-reviews__loadmore--hidden');
    }
    if (results.data.length == 0) {
      loadMore.classList.add('c-reviews__loadmore--hidden');
    }
    if (reviewsRow && results.data) {
      var reviewsScore = el.querySelector('.c-reviews__score');
      if (reviewsScore) {
        reviewsScore.classList.remove('c-reviews__score--hidden');
        var ratingInfo = el.querySelector('.c-reviews__rating__info');
        var _ratingStar = el.querySelector('.c-reviews__rating__star');
        _ratingStar.style.setProperty('--rating', results.rating);
        _ratingStar.style.setProperty('--rating-max', 5);
        _ratingStar.style.setProperty('--rating-decimal', 0.5);
        var last = '';
        if (Number.isInteger(results.rating)) {
          last = '.0';
        }
        ratingInfo.innerHTML = results.rating + last;
      }
      loadMore.innerText = "Mehr laden";
      results.data.forEach(function (review) {
        counter++;
        var reviewDiv = document.createElement('div');
        reviewDiv.classList.add('c-review');
        if (infos) {
          infos.forEach(function (info) {
            if (review.productId === Number(info.dataset.id) && info.dataset.color) {
              reviewDiv.setAttribute('id', review.productId);
              reviewDiv.setAttribute('style', '--product-color:' + info.dataset.color);
            }
          });
        }
        var reviewContent = document.createElement('div');
        reviewContent.classList.add('c-review__content');
        var reviewImage = document.createElement('div');
        reviewImage.classList.add('c-review__image');
        var reviewImageLink = document.createElement('a');
        reviewImageLink.setAttribute('rel', 'bookmark');
        reviewImageLink.setAttribute('href', review.productUrl);
        reviewImageLink.classList.add('u-absolute-fill');
        var reviewImageImg = document.createElement('img');
        reviewImageImg.setAttribute('src', review.productImageThumbnailUrl);
        reviewImageImg.classList.add('u-absolute-fill');
        var reviewAuthor = document.createElement('p');
        reviewAuthor.classList.add('c-review__author');
        reviewAuthor.innerText = review.author;
        var reviewLocation = document.createElement('div');
        reviewLocation.classList.add('c-review__location');
        reviewLocation.innerText = review.location;
        var reviewRating = document.createElement('div');
        if (ratingStar) {
          reviewRating.classList.add('c-review__rating');
          reviewRating.setAttribute('data-rating', review.reviewRating);
          for (var i = 0; i < review.reviewRating; i++) {
            reviewRating.innerHTML = reviewRating.innerHTML + ratingStar.innerHTML;
          }
        }
        var reviewText = document.createElement('div');
        reviewText.classList.add('c-review__text');
        reviewText.innerHTML = review.reviewMessage;
        $clamp(reviewText, {
          clamp: 5
        });
        var reviewMoreLink = document.createElement('span');
        reviewMoreLink.classList.add('c-button');
        reviewMoreLink.innerHTML = 'Read More';
        var reviewMore = document.createElement('div');
        reviewMore.classList.add('c-review__link');
        if (reviewText.innerText.length > 160) {
          reviewMore.appendChild(reviewMoreLink);
        }
        var textLineCount = reviewText.getClientRects().length;
        var lineClampValue = reviewText.style.lineClamp;
        if (textLineCount > lineClampValue) {
          reviewText.classList.add('cut');
        }
        reviewImageLink.appendChild(reviewImageImg);
        reviewImage.appendChild(reviewImageLink);
        reviewContent.appendChild(reviewImage);
        reviewContent.appendChild(reviewAuthor);
        reviewContent.appendChild(reviewLocation);
        if (ratingStar) {
          reviewContent.appendChild(reviewRating);
        }
        reviewContent.appendChild(reviewText);
        reviewContent.appendChild(reviewMore);
        reviewDiv.appendChild(reviewContent);
        reviewsRow.appendChild(reviewDiv);
        var reviewElements = document.querySelectorAll('.c-review');
        reviewMore.addEventListener('click', function (e) {
          if (reviewElements) {
            if (!e.currentTarget.parentNode.parentNode.classList.contains('c-review--full')) {
              $clamp(e.currentTarget.previousElementSibling, {
                clamp: 'initial'
              });
              e.currentTarget.parentNode.parentNode.classList.add('c-review--full');
              e.currentTarget.querySelector('.c-button').innerText = 'read less';
            } else {
              reviewElements.forEach(function (reviewElement) {
                reviewElement.classList.remove('c-review--full');
              });
              $clamp(e.currentTarget.previousElementSibling, {
                clamp: 5
              });
              e.currentTarget.querySelector('.c-button').innerText = 'read more';
            }
          }
        });
      });
    }
  }).catch(function (error) {
    el.classList.add('hide');
    console.log('Getting error');
  });
}
window.onload = function () {
  stampedReviews();
};
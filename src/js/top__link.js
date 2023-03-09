import debounce from 'lodash.debounce';
const topLink = document.querySelector('.top__link');
document.addEventListener(
  'scroll',
  debounce(() => {
    onTop();
  }, 200)
);
function onTop() {
  if (document.body.scrollTop > 70 || document.documentElement.scrollTop > 70) {
    topLink.style.opacity = '1';
  } else {
    topLink.style.opacity = '0';
  }
}
document.querySelector('.top__link').addEventListener('click', () => {
  topLink.style.opacity = '0';
});

/**
 * Code
 */
// eslint-disable-next-line no-unused-vars
const deleteProduct = btn => {
  const productId = btn.parentNode.querySelector('[name=productId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

  fetch(`/admin/product/${productId}`, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrf,
    },
  })
    .then(response => console.log(response))
    .catch(err => console.log(err));
};

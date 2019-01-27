const modcardErroredTemplate = (error) => `
  <div class="modcard-errored">
    <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
    <p>${error || 'An unknown error occurred.'}</p>
  </div>
`;

export default modcardErroredTemplate;

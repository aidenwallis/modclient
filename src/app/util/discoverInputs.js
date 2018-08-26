function discoverInputs(node) {
  const map = {};
  const inputs = node.querySelectorAll('input:not([type=\'submit\'])');
  console.log(inputs);
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    if (input.type === 'checkbox') {
      map[input.name] = input.checked;
    } else {
      map[input.name] = input.value;
    }
  }
  return map;
}

export default discoverInputs;

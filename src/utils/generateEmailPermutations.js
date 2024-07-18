const generateEmailPermutations = (firstName, lastName, domain) => {
  const variations = [
    `${firstName}`,
    `${firstName[0]}`,
    `${firstName}.${lastName}`,
    `${firstName[0]}.${lastName}`,
    `${firstName}${lastName[0]}`,
    `${firstName}${lastName}`,
    `${firstName}_${lastName}`,
    `${firstName}.${lastName[0]}`,
  ];

  return variations.map((variation) => `${variation}@${domain}`);
};

export default generateEmailPermutations;

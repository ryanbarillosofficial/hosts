const idk = [1, 2, 3, 4, 5, false, 7, 8, 9, 10, 11];

for (let i = 0; i < idk.length; i++) {
  const dataTypeOld = typeof idk[0];
  if (typeof idk[i] !== dataTypeOld) {
    throw new Error(
      `Entry #${i + 1} does NOT have the same data type as before!`
    );
  }
}

class KeyWerk {
  constructor(name) {
    this.name = name;
  }
}

const a = new KeyWerk("Hi");
// const a = null;
console.log(a instanceof KeyWerk == false);

const Benchmark = require("benchmark");
const { mergeBackward } = require("../src/mergeBackward");
const { mergeForward } = require("../src/mergeForward");
const { mergeWithCursor } = require("../src/mergeWithCursor");
const { names, colors } = require("../src/data");

const suite = new Benchmark.Suite("Merge");
suite
  .add("merge with forward", () => {
    mergeForward(names.slice(), colors.slice());
  })
  .add(`merge with backward`, () => {
    mergeBackward(names.slice(), colors.slice());
  })
  .add(`merge without free memory`, () => {
    mergeWithCursor(names.slice(), colors.slice());
  })
  .on("error", (e) => console.log(e))
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .on("complete", function () {
    const fastest = this.filter("fastest").map("name")[0];
    console.log("\nFastest is: " + fastest);
  })
  .run();

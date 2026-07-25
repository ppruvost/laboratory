function construireHistogramme(data, idCanvas) {

  const canvas = document.getElementById(idCanvas);
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const min = Math.min(...data);
  const max = Math.max(...data);

  const bins = 5;
  const step = (max - min) / bins;

  let histogram = Array(bins).fill(0);

  data.forEach(v => {
    let index = Math.min(Math.floor((v - min) / step), bins - 1);
    histogram[index]++;
  });

  const maxCount = Math.max(...histogram);

  histogram.forEach((h, i) => {

    const x = i * 60;
    const height = (h / maxCount) * 100;

    ctx.fillStyle = "#4a6fa5";
    ctx.fillRect(x, 120 - height, 40, height);

    ctx.fillStyle = "black";
    ctx.fillText(h, x + 15, 130);
  });
}

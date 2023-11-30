function durationProject(start, end) {
    let durasi = end - start;
    let day = Math.floor(durasi / 1000 / 60 / 60 / 24);
    let month = Math.floor(day / 30);
    let year = Math.floor(month / 12);
    const duration = year > 0 ? `${year} tahun` : month > 0 ? `${month} bulan` : `${day} hari`;
    return duration;
}

module.exports = { durationProject };

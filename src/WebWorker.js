export default class WebWorker {
    constructor(worker) {
        const code = worker.toString();
        const blob = new Blob([`(${code})()`], { type: 'application/javascript' }); // Explicitly set the MIME type
        return new Worker(URL.createObjectURL(blob), { type: "module" });
    }
}
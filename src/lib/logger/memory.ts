export function logMemoryUsage(label = "Memory usage") {
	const memoryData = process.memoryUsage();

	console.log(`\n=== ${label} ===`);
	console.log(`RSS: ${Math.round(memoryData.rss / 1024 / 1024)} MB`);
	console.log(
		`Heap Total: ${Math.round(memoryData.heapTotal / 1024 / 1024)} MB`,
	);
	console.log(
		`Heap Used: ${Math.round(memoryData.heapUsed / 1024 / 1024)} MB`,
	);
	console.log(
		`External: ${Math.round(memoryData.external / 1024 / 1024)} MB`,
	);
}

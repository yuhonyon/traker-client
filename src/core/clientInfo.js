export default function () {
		return {
			ua: navigator.userAgent,
			cleintWidth: window.screen.height,
			cleintHeight: window.screen.width,
			title: document.title || '',
			referrer: document.referrer || '',
			url: document.URL || '',
			domain: document.domain || '',
		}
}

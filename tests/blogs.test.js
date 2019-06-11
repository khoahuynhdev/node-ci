const Page = require('./helpers/page');
let page;

beforeEach(async () => {
	page = await Page.build();
	await page.goto('http://localhost:3000');
})

afterEach(async () => {
	await page.close();
})

describe('When logged in', async () => {
	beforeEach(async () => {
		await page.login()
		await page.click('a.btn-floating');
	})

	test('can see blog create form', async () => {
		const label = await page.getContentsOf('form label');

		expect(label).toEqual('Blog Title');
	})

	describe('And using valid input', async ()=> {
		beforeEach(async () => {
			await page.type('.title input', 'Type title from Puppeteer');
			await page.type('.content input', 'Type content from Puppeteer');
			await page.click('form button');
		})

		test('submiting takes user to review screen', async () => {
			const text = await page.getContentsOf('form h5');
			expect(text).toEqual('Please confirm your entries');
		})

		test('submiting then saving adds to blog index pages', async () => {
			await page.click('button.green');
			await page.waitFor('.card');
			const title = await page.getContentsOf('.card-title');
			const content = await page.getContentsOf('p');
			expect(title).toEqual('Type title from Puppeteer');
			expect(content).toEqual('Type content from Puppeteer');
		})
	})

	describe('And using invalid input', async () => {
		beforeEach(async () => {
			await page.click('form button');
		})
		test('the form shows an error message', async () => {
			const titleError = await page.getContentsOf('.title .red-text ');
			const contentError = await page.getContentsOf('.content .red-text');

			expect(titleError).toEqual('You must provide a value');
			expect(contentError).toEqual('You must provide a value');
		})
	})

})

describe('When user is not logged in', async () => {
	test('User cannot create blogs posts', async () => {
		const result = await page.evaluate(
			() => {
				return fetch('/api/blogs', {
					method: 'POST',
					credentials: 'same-origin',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ title: 'My Title', content: 'my content'})
				}).then(res => res.json());
			}
		);
		
		expect(JSON.stringify(result)).toEqual('{"error":"You must log in!"}');
	});

	test('User cannot view blogs posts', async () => {
		const result = await page.get('/api/blogs')

		expect(JSON.stringify(result)).toEqual('{"error":"You must log in!"}');
	})
})
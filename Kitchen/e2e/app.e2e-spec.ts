import { KitchenPage } from './app.po';

describe('kitchen App', () => {
  let page: KitchenPage;

  beforeEach(() => {
    page = new KitchenPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

describe('resize', () => {
  it('should move between lists', () => {
    cy.visit(
      '/iframe.html?args=&id=single-vertical-list--basic&viewMode=story',
    );
    // cy.visit('/iframe.html?args=&id=single-vertical-list--large-data-set&viewMode=story');
    // cy.visit('/iframe.html?args=&id=board--large-data-set&viewMode=story');
    // cy.visit("https://react-forked-dnd.netlify.app/iframe.html?args=&id=board--large-data-set&viewMode=story");
    const dimensions = [400, 550];
    function resize(landscape: boolean) {
      cy.wait(5000)
        .viewport(...(dimensions.reverse() as [number, number]))
        .then(() => resize(!landscape));
    }

    resize(true);
  });
});

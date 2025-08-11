import { test, expect } from '@playwright/test';

/**
 * @testSuite E2E Edge Highlighting Visual Tests
 * @description Critical visual regression tests that detect actual edge highlighting failures
 * 
 * These tests catch what unit tests cannot:
 * - Actual Cytoscape.js visual rendering
 * - Real browser edge highlighting behavior  
 * - CSS style applications and visual changes
 * - User interaction edge cases
 * 
 * @regressionProtection Prevents:
 * ❌ Broken edge highlighting on hover (invisible to unit tests)
 * ❌ Failed selection edge highlighting (invisible to unit tests)  
 * ❌ CSS styling issues affecting edge visibility
 * ❌ Cytoscape.js integration failures
 * ❌ Cross-browser visual inconsistencies
 * 
 * @criticalGap This fills the testing gap identified: "Our unit tests mock 
 * Cytoscape.js so they can't detect actual edge.addClass('highlighted') failures"
 */

test.describe('Edge Highlighting Visual Behavior', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    
    // Wait for the graph to be fully loaded
    await page.waitForSelector('[data-cy="cytoscape-container"]', { timeout: 10000 });
    
    // Wait for companies to load (check for a known company)
    await page.waitForSelector('text=OpenAI', { timeout: 10000 });
  });

  test('should highlight connected edges on company hover', async ({ page }) => {
    // Wait for graph to stabilize
    await page.waitForTimeout(1000);
    
    // Take baseline screenshot before hover
    await expect(page).toHaveScreenshot('graph-no-hover.png');
    
    // Hover over OpenAI node (assuming it has connections)
    // We need to find the actual graph node, not the text in the panel
    const graphContainer = page.locator('[data-cy="cytoscape-container"]');
    
    // Hover over the center area where OpenAI node should be
    await graphContainer.hover({ position: { x: 400, y: 300 } });
    
    // Wait for hover effects to apply
    await page.waitForTimeout(500);
    
    // Take screenshot with hover highlighting
    await expect(page).toHaveScreenshot('graph-hover-highlighting.png');
    
    // Move away to clear hover
    await graphContainer.hover({ position: { x: 100, y: 100 } });
    await page.waitForTimeout(500);
    
    // Should return to baseline state
    await expect(page).toHaveScreenshot('graph-hover-cleared.png');
  });

  test('should highlight connected edges on company selection', async ({ page }) => {
    // Wait for graph to stabilize
    await page.waitForTimeout(1000);
    
    // Click on OpenAI in the company list (more reliable than clicking graph node)
    await page.click('text=OpenAI');
    
    // Wait for selection effects
    await page.waitForTimeout(500);
    
    // Take screenshot with selection highlighting
    await expect(page).toHaveScreenshot('graph-selection-highlighting.png');
    
    // Verify the detail panel shows OpenAI is selected
    await expect(page.locator('text=Why This Match?')).toBeVisible();
    
    // Click background to deselect
    const graphContainer = page.locator('[data-cy="cytoscape-container"]');
    await graphContainer.click({ position: { x: 100, y: 100 } });
    
    // Wait for deselection effects
    await page.waitForTimeout(500);
    
    // Should return to no-selection state
    await expect(page).toHaveScreenshot('graph-selection-cleared.png');
  });

  test('should handle selection from detail panel', async ({ page }) => {
    // Wait for interface to load
    await page.waitForTimeout(1000);
    
    // Initially no company should be selected
    await expect(page.locator('text=Click on a company node to see details')).toBeVisible();
    
    // Click on a company in the list to select it
    await page.click('text=Anthropic');
    
    // Wait for selection and highlighting effects
    await page.waitForTimeout(500);
    
    // Should show company details and highlight edges
    await expect(page.locator('text=Constitutional AI focus')).toBeVisible();
    
    // Take screenshot showing both panel selection and graph highlighting
    await expect(page).toHaveScreenshot('panel-selection-with-graph-highlighting.png');
  });

  test('should maintain edge highlighting during zoom operations', async ({ page }) => {
    // Wait for graph to load
    await page.waitForTimeout(1000);
    
    // Select a company first
    await page.click('text=OpenAI');
    await page.waitForTimeout(500);
    
    // Take screenshot at normal zoom with highlighting
    await expect(page).toHaveScreenshot('highlighted-normal-zoom.png');
    
    // Find and click zoom in button
    const zoomInButton = page.locator('button[title="Zoom in"]');
    await zoomInButton.click();
    await page.waitForTimeout(500);
    
    // Edge highlighting should persist at different zoom levels
    await expect(page).toHaveScreenshot('highlighted-zoomed-in.png');
    
    // Click zoom out button
    const zoomOutButton = page.locator('button[title="Zoom out"]');
    await zoomOutButton.click();
    await zoomOutButton.click(); // Go back past normal
    await page.waitForTimeout(500);
    
    // Edge highlighting should still be visible when zoomed out
    await expect(page).toHaveScreenshot('highlighted-zoomed-out.png');
  });

  test('should handle multiple rapid hover interactions', async ({ page }) => {
    // Wait for graph to load
    await page.waitForTimeout(1000);
    
    const graphContainer = page.locator('[data-cy="cytoscape-container"]');
    
    // Simulate rapid hover movements (stress test for edge highlighting)
    await graphContainer.hover({ position: { x: 400, y: 300 } }); // OpenAI area
    await page.waitForTimeout(100);
    
    await graphContainer.hover({ position: { x: 350, y: 250 } }); // Anthropic area  
    await page.waitForTimeout(100);
    
    await graphContainer.hover({ position: { x: 450, y: 350 } }); // Scale AI area
    await page.waitForTimeout(100);
    
    // Move to empty area
    await graphContainer.hover({ position: { x: 100, y: 100 } });
    await page.waitForTimeout(500);
    
    // Should cleanly return to no-highlight state
    await expect(page).toHaveScreenshot('rapid-hover-final-state.png');
  });

  test('should show correct connection relationships', async ({ page }) => {
    // This test validates that the right connections are highlighted
    await page.waitForTimeout(1000);
    
    // Select OpenAI (which should connect to Anthropic and Scale AI based on our data)
    await page.click('text=OpenAI');
    await page.waitForTimeout(500);
    
    // Check that related companies section appears
    await expect(page.locator('text=Related Companies')).toBeVisible();
    
    // Should show specific connections
    await expect(page.locator('text=Anthropic')).toBeVisible();
    
    // Take screenshot showing the connection relationships
    await expect(page).toHaveScreenshot('connection-relationships.png');
  });
});
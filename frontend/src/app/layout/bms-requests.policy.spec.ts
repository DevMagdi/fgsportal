import { BmsRequestContext, shouldLoadBmsAbilities, shouldLoadBmsAlerts, shouldLoadBmsNotifications } from './bms-requests.policy';

describe('BMS request policy of the global shell', () => {
  const context = (overrides: Partial<BmsRequestContext>): BmsRequestContext =>
    ({ inBms: false, moduleEnabled: true, abilities: [], failed: false, ...overrides });

  it('asks for abilities only when the company owns BMS or the user is on a BMS page', () => {
    expect(shouldLoadBmsAbilities({ inBms: false, moduleEnabled: false })).toBe(false);
    expect(shouldLoadBmsAbilities({ inBms: false, moduleEnabled: true })).toBe(true);
    expect(shouldLoadBmsAbilities({ inBms: true, moduleEnabled: false })).toBe(true);
  });

  it('requests alerts only with a confirmed opportunities.view ability', () => {
    expect(shouldLoadBmsAlerts(context({ abilities: ['opportunities.view'] }))).toBe(true);
    expect(shouldLoadBmsAlerts(context({ abilities: ['units.view'] }))).toBe(false);
    expect(shouldLoadBmsAlerts(context({ abilities: [], inBms: true }))).toBe(false);
    expect(shouldLoadBmsAlerts(context({ abilities: null }))).toBe(false);
    expect(shouldLoadBmsAlerts(context({ abilities: ['opportunities.view'], failed: true }))).toBe(false);
    expect(shouldLoadBmsAlerts(context({ abilities: ['opportunities.view'], moduleEnabled: false }))).toBe(false);
  });

  it('requests notifications for BMS users anywhere and for anyone on a BMS page', () => {
    expect(shouldLoadBmsNotifications(context({ abilities: ['units.view'] }))).toBe(true);
    expect(shouldLoadBmsNotifications(context({ abilities: [] }))).toBe(false);
    expect(shouldLoadBmsNotifications(context({ abilities: [], inBms: true }))).toBe(true);
    expect(shouldLoadBmsNotifications(context({ abilities: [], inBms: true, moduleEnabled: false }))).toBe(true);
    expect(shouldLoadBmsNotifications(context({ abilities: null, inBms: true }))).toBe(false);
    expect(shouldLoadBmsNotifications(context({ abilities: ['units.view'], failed: true }))).toBe(false);
    expect(shouldLoadBmsNotifications(context({ abilities: ['units.view'], moduleEnabled: false }))).toBe(false);
  });
});

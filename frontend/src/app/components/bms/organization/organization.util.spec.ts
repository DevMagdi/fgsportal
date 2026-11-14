import {
  buildUnitTree, distinctPeople, flattenReporting, flattenTree, initials, personName, productsForUnit,
  progressForUnit, reportingLines, unitHeadcount, unitNameById, unitRoleNames,
} from './organization.util';

describe('Organization helpers', () => {
  const person = (id: number, name: string) => ({ id, username: name.toLowerCase(), firstname: name, lastname: '' });
  const units: any[] = [
    { id: 1, name: 'Alpha Iota', parent_id: null, director: person(10, 'Dina'), users: [person(10, 'Dina')] },
    { id: 3, name: 'Alpha X', parent_id: 1, users: [person(11, 'Omar'), person(12, 'Sara')] },
    { id: 2, name: 'Alpha Gen', parent_id: 1, director: person(13, 'Ali'), users: [person(12, 'Sara')] },
    { id: 4, name: 'Lab', parent_id: 3, users: [] },
  ];

  it('names people from first and last name, then falls back', () => {
    expect(personName({ id: 1, firstname: 'Mona', lastname: 'Adel', username: 'm.adel' })).toBe('Mona Adel');
    expect(personName({ id: 1, username: 'm.adel' })).toBe('m.adel');
    expect(personName({ id: 1, name: 'Prepared' })).toBe('Prepared');
    expect(personName(null)).toBe('-');
    expect(initials('Mona Adel')).toBe('MA');
    expect(initials('mona')).toBe('M');
    expect(initials('-')).toBe('?');
    expect(initials('منى عادل')).toBe('مع');
  });

  it('builds the unit hierarchy in name order and keeps depth', () => {
    const tree = buildUnitTree(units);
    expect(tree.length).toBe(1);
    expect(tree[0].unit.name).toBe('Alpha Iota');
    expect(tree[0].children.map(node => node.unit.name)).toEqual(['Alpha Gen', 'Alpha X']);
    expect(tree[0].children[1].children[0].unit.name).toBe('Lab');
    expect(flattenTree(tree).map(node => node.depth)).toEqual([0, 1, 1, 2]);
  });

  it('keeps a unit whose parent is not visible, and survives a parent cycle', () => {
    const scoped = buildUnitTree([{ id: 3, name: 'Alpha X', parent_id: 1 }, { id: 4, name: 'Lab', parent_id: 3 }]);
    expect(scoped.map(node => node.unit.name)).toEqual(['Alpha X']);
    expect(scoped[0].children[0].unit.name).toBe('Lab');
    const cyclic = flattenTree(buildUnitTree([{ id: 1, name: 'A', parent_id: 2 }, { id: 2, name: 'B', parent_id: 1 }]));
    expect(cyclic.map(node => node.unit.name).sort()).toEqual(['A', 'B']);
  });

  it('counts every person once, however many units they belong to', () => {
    const people = distinctPeople(units);
    expect(people.length).toBe(3);
    const sara = people.find(entry => entry.person.id === 12)!;
    expect(sara.unitIds.sort()).toEqual([2, 3]);
    expect(people.filter(entry => entry.unitIds.length > 1).length).toBe(1);
  });

  it('counts assigned members only, the same basis as the backend headcount', () => {
    expect(unitHeadcount(units[0])).toBe(1);
    expect(unitHeadcount(units[2])).toBe(1);
    expect(unitHeadcount(units[3])).toBe(0);
  });

  it('selects products and progress by unit', () => {
    const products: any[] = [
      { id: 1, product_name: 'Kraken', business_units: [{ id: 3, name: 'Alpha X' }, { id: 2, name: 'Alpha Gen' }] },
      { id: 2, product_name: 'Argus', business_units: [{ id: 2, name: 'Alpha Gen' }] },
      { id: 3, product_name: 'Loose' },
    ];
    expect(productsForUnit(products, 2).map(product => product.product_name)).toEqual(['Kraken', 'Argus']);
    expect(productsForUnit(products, 4)).toEqual([]);
    expect(progressForUnit([{ id: 2, total: 4, achieved: 1, in_progress: 2, not_done: 1, blocked: 0, progress: 40 }], 2)!.progress).toBe(40);
    expect(progressForUnit(null, 2)).toBeNull();
    expect(progressForUnit([], 2)).toBeNull();
  });

  it('draws reporting lines from manager_id among the members of a unit', () => {
    const members: any[] = [
      { id: 1, name: 'Lead', manager_id: 99, manager: 'Outside Boss' },
      { id: 2, name: 'Dev B', manager_id: 1 },
      { id: 3, name: 'Dev A', manager_id: 1 },
      { id: 4, name: 'Junior', manager_id: 3 },
      { id: 5, name: 'Solo', manager_id: null },
      { id: 6, name: 'External report', manager_id: 77 },
    ];
    const result = reportingLines(members);
    expect(result.lines.length).toBe(1);
    expect(result.lines[0].employee.name).toBe('Lead');
    expect(result.lines[0].reports.map(node => node.employee.name)).toEqual(['Dev A', 'Dev B']);
    expect(result.lines[0].reports[0].reports[0].employee.name).toBe('Junior');
    expect(result.unattached.map(member => member.name)).toEqual(['External report', 'Solo']);
    expect(result.linked).toBe(3);
    expect(flattenReporting(result.lines).map(node => node.depth)).toEqual([0, 1, 2, 1]);
  });

  it('never loses a member, even with a self reference or a cycle', () => {
    const result = reportingLines([
      { id: 1, name: 'Self', manager_id: 1 },
      { id: 2, name: 'Loop A', manager_id: 3 },
      { id: 3, name: 'Loop B', manager_id: 2 },
    ] as any[]);
    const shown = flattenReporting(result.lines).map(node => node.employee.name).concat(result.unattached.map(member => member.name));
    expect(shown.sort()).toEqual(['Loop A', 'Loop B', 'Self']);
    expect(reportingLines([])).toEqual({ lines: [], unattached: [], linked: 0 });
  });

  it('lists only the roles scoped to the unit, and names units by id', () => {
    const employee: any = { id: 1, name: 'X', roles: [
      { id: 1, name: 'Unit Director', slug: 'unit_director', business_unit_id: 3 },
      { id: 2, name: 'Employee', slug: 'employee', business_unit_id: null },
      { id: 3, name: 'Coordinator', slug: 'coordinator', business_unit_id: 2 },
    ] };
    expect(unitRoleNames(employee, 3)).toEqual(['Unit Director']);
    expect(unitRoleNames({ id: 2, name: 'Y' } as any, 3)).toEqual([]);
    expect(unitNameById(units, 3)).toBe('Alpha X');
    expect(unitNameById(units, 42)).toBe('#42');
    expect(unitNameById(units, null)).toBe('');
  });
});

// Helper: mock the Date constructor so getHours() and getMinutes() return
// values derived from the provided hour and minute.
export function mockDate(hours: number, minutes: number) {
  const mockDateInstance = {
    getHours: () => hours,
    getMinutes: () => minutes,
  };
  jest
    .spyOn(global, "Date")
    .mockImplementation(() => mockDateInstance as unknown as Date);
}

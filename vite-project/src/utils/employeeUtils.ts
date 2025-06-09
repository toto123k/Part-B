export function calculateAge(birthdate: Date): number {
  const today = new Date();
  const age = today.getFullYear() - birthdate.getFullYear();
  if (
    today.getMonth() < birthdate.getMonth() ||
    (today.getMonth() === birthdate.getMonth() &&
      today.getDate() < birthdate.getDate())
  ) {
    return age - 1;
  }
  return age;
}


export default function isRunningInCI(): boolean {
  return Boolean(process.env.CI);
}

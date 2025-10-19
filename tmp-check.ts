import prisma from './src/lib/db';

async function main() {
  console.log('has workflow', typeof (prisma as any).workflow?.create);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

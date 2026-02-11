import prisma from './client.js';
import bcrypt from 'bcryptjs';

async function main() {
    console.log('🌱 Seeding database...');

    // Clean existing data (in reverse dependency order)
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.progressLog.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.workoutSet.deleteMany();
    await prisma.workout.deleteMany();
    await prisma.exercise.deleteMany();
    await prisma.user.deleteMany();

    // --- Users ---
    const hashedPassword = await bcrypt.hash('password123', 12);

    const john = await prisma.user.create({
        data: {
            user_name: 'John Doe',
            user_email: 'john@fitfusion.com',
            user_password: hashedPassword,
            xp: 150,
            streak: 5,
            lastWorkout: new Date(Date.now() - 86400000), // yesterday
        },
    });

    const jane = await prisma.user.create({
        data: {
            user_name: 'Jane Smith',
            user_email: 'jane@fitfusion.com',
            user_password: hashedPassword,
            xp: 300,
            streak: 10,
            lastWorkout: new Date(Date.now() - 86400000),
        },
    });

    console.log('✅ Users created');

    // --- Exercises ---
    const benchPress = await prisma.exercise.create({
        data: { name: 'Bench Press', muscleGroup: 'Chest', userId: null },
    });
    const squat = await prisma.exercise.create({
        data: { name: 'Squat', muscleGroup: 'Legs', userId: null },
    });
    const deadlift = await prisma.exercise.create({
        data: { name: 'Deadlift', muscleGroup: 'Back', userId: null },
    });
    const ohp = await prisma.exercise.create({
        data: { name: 'Overhead Press', muscleGroup: 'Shoulders', userId: null },
    });
    const pullups = await prisma.exercise.create({
        data: { name: 'Pull-ups', muscleGroup: 'Back', userId: null },
    });

    console.log('✅ Exercises created');

    // --- Workouts ---
    const chestDay = await prisma.workout.create({
        data: {
            userId: john.user_id,
            title: 'Chest Day',
            date: new Date(Date.now() - 86400000),
        },
    });

    const legDay = await prisma.workout.create({
        data: {
            userId: john.user_id,
            title: 'Leg Day',
            date: new Date(Date.now() - 172800000),
        },
    });

    const upperBody = await prisma.workout.create({
        data: {
            userId: jane.user_id,
            title: 'Upper Body',
            date: new Date(Date.now() - 86400000),
        },
    });

    // --- Workout Sets ---
    await prisma.workoutSet.createMany({
        data: [
            { workoutId: chestDay.id, exerciseId: benchPress.id, reps: 10, weight: 135, rpe: 7, order: 1 },
            { workoutId: chestDay.id, exerciseId: benchPress.id, reps: 8, weight: 155, rpe: 8, order: 2 },
            { workoutId: chestDay.id, exerciseId: benchPress.id, reps: 6, weight: 175, rpe: 9, order: 3 },
            { workoutId: legDay.id, exerciseId: squat.id, reps: 10, weight: 185, rpe: 7, order: 1 },
            { workoutId: legDay.id, exerciseId: squat.id, reps: 8, weight: 205, rpe: 8, order: 2 },
            { workoutId: legDay.id, exerciseId: deadlift.id, reps: 5, weight: 225, rpe: 8, order: 3 },
            { workoutId: upperBody.id, exerciseId: ohp.id, reps: 10, weight: 95, rpe: 7, order: 1 },
            { workoutId: upperBody.id, exerciseId: pullups.id, reps: 12, weight: null, rpe: 6, order: 2 },
        ],
    });

    console.log('✅ Workouts & sets created');

    // --- Attendance ---
    await prisma.attendance.createMany({
        data: [
            {
                userId: john.user_id,
                checkIn: new Date(Date.now() - 90 * 60000 - 86400000),
                checkOut: new Date(Date.now() - 86400000),
                durationMinutes: 90,
            },
            {
                userId: jane.user_id,
                checkIn: new Date(Date.now() - 75 * 60000 - 86400000),
                checkOut: new Date(Date.now() - 86400000),
                durationMinutes: 75,
            },
        ],
    });

    console.log('✅ Attendance records created');

    // --- Progress Logs ---
    await prisma.progressLog.createMany({
        data: [
            { userId: john.user_id, weight: 180.5, bodyFat: 15.2, date: new Date(Date.now() - 604800000) },
            { userId: jane.user_id, weight: 140.0, bodyFat: 20.5, date: new Date(Date.now() - 604800000) },
        ],
    });

    console.log('✅ Progress logs created');

    // --- Categories ---
    const supplements = await prisma.category.create({
        data: { name: 'Supplements', description: 'Nutritional supplements for fitness goals' },
    });
    const equipment = await prisma.category.create({
        data: { name: 'Equipment', description: 'Gym and home workout equipment' },
    });
    const apparel = await prisma.category.create({
        data: { name: 'Apparel', description: 'Fitness clothing and accessories' },
    });

    console.log('✅ Categories created');

    // --- Products ---
    const wheyProtein = await prisma.product.create({
        data: {
            name: 'Whey Protein Isolate',
            description: 'Premium whey protein isolate — 25g protein per serving, 30 servings',
            price: 49.99,
            imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2c129?w=400',
            stock: 100,
            categoryId: supplements.id,
        },
    });

    const creatine = await prisma.product.create({
        data: {
            name: 'Creatine Monohydrate',
            description: 'Pure creatine monohydrate powder — 5g per serving, 60 servings',
            price: 29.99,
            imageUrl: 'https://images.unsplash.com/photo-1619735820797-edd778cd5282?w=400',
            stock: 150,
            categoryId: supplements.id,
        },
    });

    const bands = await prisma.product.create({
        data: {
            name: 'Resistance Bands Set',
            description: 'Set of 5 resistance bands with varying resistance levels',
            price: 24.99,
            imageUrl: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400',
            stock: 75,
            categoryId: equipment.id,
        },
    });

    const yogaMat = await prisma.product.create({
        data: {
            name: 'Premium Yoga Mat',
            description: 'Extra-thick, non-slip yoga mat — 72" x 24" x 6mm',
            price: 39.99,
            imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
            stock: 50,
            categoryId: equipment.id,
        },
    });

    const tshirt = await prisma.product.create({
        data: {
            name: 'FitFusion Performance Tee',
            description: 'Moisture-wicking performance t-shirt with FitFusion branding',
            price: 34.99,
            imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
            stock: 200,
            categoryId: apparel.id,
        },
    });

    console.log('✅ Products created');

    // --- Cart Items (for John) ---
    await prisma.cartItem.createMany({
        data: [
            { userId: john.user_id, productId: wheyProtein.id, quantity: 2 },
            { userId: john.user_id, productId: bands.id, quantity: 1 },
        ],
    });

    console.log('✅ Cart items created');

    // --- Orders ---
    const order1 = await prisma.order.create({
        data: {
            userId: john.user_id,
            totalAmount: 84.98,
            status: 'delivered',
            shippingAddress: '123 Fitness St, Gym City, GC 12345',
            items: {
                create: [
                    { productId: creatine.id, quantity: 1, price: 29.99 },
                    { productId: tshirt.id, quantity: 1, price: 34.99 },
                    { productId: yogaMat.id, quantity: 1, price: 39.99 },
                ],
            },
        },
    });

    const order2 = await prisma.order.create({
        data: {
            userId: jane.user_id,
            totalAmount: 49.99,
            status: 'pending',
            shippingAddress: '456 Muscle Ave, Flex Town, FT 67890',
            items: {
                create: [
                    { productId: wheyProtein.id, quantity: 1, price: 49.99 },
                ],
            },
        },
    });

    console.log('✅ Orders created');
    console.log('');
    console.log('🎉 Seed complete!');
    console.log(`   Users: ${john.user_email}, ${jane.user_email}`);
    console.log('   Test login: john@fitfusion.com / password123');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

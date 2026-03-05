#!/bin/bash
# Safe migration script for production - ONLY adds CRM data, doesn't delete existing users
# Created: 2026-02-28

echo "🚀 Starting safe CRM data migration..."
echo ""

# Check if files exist
if [ ! -f "crm-orders.json" ]; then
    echo "❌ ERROR: crm-orders.json not found!"
    exit 1
fi

if [ ! -f "crm-course-payments.json" ]; then
    echo "❌ ERROR: crm-course-payments.json not found!"
    exit 1
fi

if [ ! -f "crm-imported-users.json" ]; then
    echo "❌ ERROR: crm-imported-users.json not found!"
    exit 1
fi

echo "✅ All migration files found"
echo ""

# Show current state
echo "📊 Current database state:"
mongo rejuvena --quiet --eval "
print('Users:', db.users.count());
print('Orders:', db.orders.count());
print('Payments:', db.payments.count());
"
echo ""

# Ask for confirmation
read -p "⚠️  Continue with migration? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Migration cancelled."
    exit 0
fi

echo ""
echo "📥 Step 1: Importing CRM users (upsert by email)..."
mongoimport --db rejuvena --collection users --file crm-imported-users.json --mode upsert --upsertFields email
echo ""

echo "📥 Step 2: Importing CRM orders (upsert by orderNumber)..."
mongoimport --db rejuvena --collection orders --file crm-orders.json --mode upsert --upsertFields orderNumber
echo ""

echo "📥 Step 3: Importing CRM course payments (upsert by orderNumber)..."
mongoimport --db rejuvena --collection payments --file crm-course-payments.json --mode upsert --upsertFields orderNumber
echo ""

# Verify migration
echo "✅ Migration completed!"
echo ""
echo "📊 New database state:"
mongo rejuvena --quiet --eval "
print('Users:', db.users.count());
print('Orders:', db.orders.count());
print('Payments:', db.payments.count());
print('');
print('CRM Orders imported:', db.orders.find({orderNumber: /^CRM-/}).count());
print('CRM Payments imported:', db.payments.find({orderNumber: /^CRM-COURSE-/}).count());
"
echo ""

echo "🎉 Migration successful!"
echo ""
echo "⚠️  IMPORTANT: Verify that existing users were not affected:"
echo "  mongo rejuvena --eval 'db.users.find({isPremium: true}).limit(3).forEach(u => print(u.email, \"-\", u.createdAt))'"

console.log('=== CHECKING DEPENDENCIES ===\n');

try {
    const bcrypt = require('bcrypt');
    console.log('✅ bcrypt:', bcrypt.version || 'installed');
} catch (e) {
    console.log('❌ bcrypt NOT INSTALLED');
}

try {
    const jwt = require('jsonwebtoken');
    console.log('✅ jsonwebtoken:', jwt.version || 'installed');
} catch (e) {
    console.log('❌ jsonwebtoken NOT INSTALLED');
}

try {
    const mysql = require('mysql2');
    console.log('✅ mysql2: installed');
} catch (e) {
    console.log('❌ mysql2 NOT INSTALLED');
}

try {
    const express = require('express');
    console.log('✅ express: installed');
} catch (e) {
    console.log('❌ express NOT INSTALLED');
}

try {
    const cors = require('cors');
    console.log('✅ cors: installed');
} catch (e) {
    console.log('❌ cors NOT INSTALLED');
}

console.log('\n=== ENVIRONMENT ===');
console.log('Node version:', process.version);
console.log('Current directory:', process.cwd());
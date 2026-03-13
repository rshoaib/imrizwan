try {
    require('./scripts/insert-standalone.cjs');
} catch (e) {
    require('fs').writeFileSync('error.txt', e.stack, 'utf8');
}

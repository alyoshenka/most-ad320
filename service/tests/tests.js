import assert from 'assert'
import { atOrAboveRole } from '../authorization/authorization.js'

function runAllTests() {
    assert(atOrAboveRole('user', 'user'))
    assert(atOrAboveRole('superuser', 'superuser'))
    assert(atOrAboveRole('admin', 'admin'))
    assert(atOrAboveRole('superuser', 'user'))
    assert(atOrAboveRole('admin', 'user'))
    assert(atOrAboveRole('admin', 'superuser'))

    assert(!atOrAboveRole(null, 'user'))
    assert(!atOrAboveRole(null, 'superuser'))
    assert(!atOrAboveRole(null, 'admin'))
    assert(!atOrAboveRole('user', 'superuser'))
    assert(!atOrAboveRole('user', 'admin'))
    assert(!atOrAboveRole('superuser', 'admin'))
}
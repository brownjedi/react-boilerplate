import React       from 'react'
import test        from 'ava'
import { shallow } from 'enzyme'

import Header      from '../Header'

test('renders Header properly', (t) => {
	const wrapper = shallow(<Header />)

	t.is(wrapper.find('h4').length, 1)
	t.is(wrapper.find('h4').first().text(), 'Hello World')
})

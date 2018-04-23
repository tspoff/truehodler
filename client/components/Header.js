import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import Link from 'next/link'

export default (props) => {
    return (
        <Menu style={{ marginTop: '10px' }}>
            <Link href='/'>
                <a className="item">True Hodler</a>
            </Link>
            <Menu.Menu position="right">

            </Menu.Menu>
        </Menu>
    );
};
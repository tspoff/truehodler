import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default (props) => {
    return (
        <Menu style={{ marginTop: '10px' }}>
            <Link route={'/'}>
                <a className="item">True Hodler</a>
            </Link>
            <Menu.Menu position="right">
                <Link route={'/admin'}>
                    <a className="item">Admin Panel</a>
                </Link>
            </Menu.Menu>
        </Menu>
    );
};
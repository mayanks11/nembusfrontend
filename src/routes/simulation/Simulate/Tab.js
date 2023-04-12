import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { changeTab } from 'Actions/Simulate';
import classNames from 'classnames';
import { List } from 'immutable';


const Tab = ({active, options, onChange}) => {
    if(!List.isList(options)) return null;
    useEffect(() => {
        return () => {
            onChange('p');
        }
    }, []);
    return (
        <div className="d-flex">
            {
                options.map((option, i) => (
                    <div
                        key={i}
                        className={classNames('simulate_tab_option', {
                            'simulate_tab_active': active === option.get('value')
                        })}
                        onClick={() => onChange(option.get('value'))}
                    >{option.get('label')}</div>
                ))
            }
        </div>
    )
}

const mapStateToProps = state => ({
    active: state.simulate.get('activeTab'),
    options: state.simulate.get('tabs')
});

const mapDispatchToProps = {
    onChange: changeTab
};

export default connect(mapStateToProps, mapDispatchToProps)(Tab);
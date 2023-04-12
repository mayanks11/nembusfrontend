import React , { Component } from 'react';
import { map } from 'lodash';
import IntlMessages from "Util/IntlMessages";
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import { JsonFormsReduxContext, JsonFormsDispatch } from '@jsonforms/react';
import { RctCard } from 'Components/RctCard';
import {
	Tabs,
	Tab,
	Typography,
	List,
	ListItem,
	AppBar
  } from '@material-ui/core';

// For Tab Content
function TabContainer({ children }) {
	return (
	   <Typography component="div" style={{ paddingTop: 8 * 3, paddingBottom: 8 * 3 }}>
		  { children }
	   </Typography>
	);
 }
 
class ModelInformationTabs extends Component {

    state = {
        activeIndex: 0
    }

    handleChange(value) {
        this.setState({ activeIndex: value });
    }

    render() {
		const { activeIndex } = this.state;
		const customProps = {
			customClasses:'model-info'
		};
		const { description, outputArray, inputArray, cadFile } = this.props;
        return (
			<RctCard { ...customProps }>
				<RctCollapsibleCard
					heading={<IntlMessages id="widgets.modelinformation" />}
				>
					<AppBar position="static" color="default">
						<Tabs
							value={activeIndex}
							scrollButtons="off"
							indicatorColor="primary"
							textColor="primary"
							TabIndicatorProps={{style: {background:'#5D92F4'}}}
							onChange={(e, value) => this.handleChange(value)}>
							<Tab label="Model Description" />
							<Tab label="Input Port Information" />
							<Tab label="Output Port Information" />
							<Tab label="User Port Information" />
							<Tab label="Parameters" />
							<Tab label="Technical Datasheet" />
						</Tabs>
					</AppBar>
					{activeIndex === 0 &&
					<TabContainer>
						<RctCollapsibleCard>
							{description}
						</RctCollapsibleCard>
					</TabContainer>}
					{activeIndex === 1 &&
					<TabContainer>
						<RctCollapsibleCard>
							<List>
							{inputArray &&
							inputArray.length > 0 &&
							map(inputArray, array => (
								<ListItem className="d-flex align-items-center border-bottom py-15 componenet-types">
									<span className="w-100">{array.name}</span>
									<p className="w-75 mb-0 text-right">
										{array.portType.type !== 'configuration'
										? `matrix (${array.portType.size.row} x ${array.portType.size.col} )`
										: 'configuration'}
									</p>
								</ListItem>
							))}
							</List>	
						</RctCollapsibleCard>
					</TabContainer>}
					{activeIndex === 2 &&
					<TabContainer>
						<RctCollapsibleCard>
							<List>	
								{outputArray &&
								outputArray.length > 0 &&
								map(outputArray, array => (
									<ListItem className="d-flex align-items-center border-bottom py-15 componenet-types">
										<span className="w-100">{array.name}</span>
										<p className="w-75 mb-0 text-right">
											{array.portType.type !== 'configuration'
											? `matrix (${array.portType.size.row} x ${array.portType.size.col} )`
											: 'configuration'}
										</p>
									</ListItem>
								))}
							</List>
						</RctCollapsibleCard>
					</TabContainer>}
					{activeIndex === 3 &&
					<TabContainer>
						<RctCollapsibleCard>
							<JsonFormsReduxContext>
							<JsonFormsDispatch />
							</JsonFormsReduxContext>
						</RctCollapsibleCard>
					</TabContainer>}
					{activeIndex === 4 &&
					<TabContainer>
						<RctCollapsibleCard>
						</RctCollapsibleCard>
					</TabContainer>}
					{activeIndex === 5 &&
					<TabContainer>
						<RctCollapsibleCard>
						</RctCollapsibleCard>
					</TabContainer>}
				</RctCollapsibleCard>
			</RctCard>
        );
    }
}

export default ModelInformationTabs;

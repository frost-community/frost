import {
	ActionOkResult,
	ActionErrorResult
} from 'frost-core';

export interface ActionCall {
	data: {[x: string]: any};
}

export interface ActionCallFrame extends ActionCall {
	id: string;
}

export type ActionResultFrame = ActionOkResultFrame | ActionErrorResultFrame;

export interface ActionOkResultFrame extends ActionOkResult {
	id: string;
}

export interface ActionErrorResultFrame extends ActionErrorResult {
	id: string;
}

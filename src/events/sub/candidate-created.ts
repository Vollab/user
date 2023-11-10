import { JsMsg } from 'nats'

import { candidate_created_consumer } from '../consumer'
import { candidate_model } from '../../models'

import { CandidateCreatedEvent } from 'common/types/events/candidate'
import { Subscriber } from 'common/services/nats'
import { Subjects } from 'common/types/events'

class CandidateCreatedSub extends Subscriber<CandidateCreatedEvent> {
	private static _instance: CandidateCreatedSub = new CandidateCreatedSub()

	protected consumer = candidate_created_consumer

	readonly subject = Subjects.CandidateCreated

	static get instance() {
		return this._instance
	}

	async onMessage(msg: JsMsg) {
		const { id, name, email } = this.parseMessage(msg.data)

		await candidate_model.insert({ id, name, email })

		msg.ack()
	}
}

const instance = CandidateCreatedSub.instance
export { instance as candidate_created_sub }

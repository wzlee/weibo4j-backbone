package com.javaniu.weibo4j.module;

import java.util.Date;

public abstract class BaseEntity implements java.io.Serializable {

	public static final String PROP_ID = "id";
	private static final long serialVersionUID = 7716140330714299058L;
	protected long id;
	protected Date createAt;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Date getCreateAt() {
		return this.createAt;
	}

	public void setCreateAt(Date createAt) {
		this.createAt = createAt;
	}
}

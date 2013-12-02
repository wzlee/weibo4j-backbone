package com.javaniu.weibo4j.web;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.httpclient.DefaultHttpMethodRetryHandler;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.PropertyNamingStrategy;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.javaniu.weibo4j.module.Status;

@Controller
@RequestMapping({ "statuses" })
public class StatusController {

	@RequestMapping(value = { "public_timeline" }, method = { RequestMethod.GET })
	public @ResponseBody
	List<Status> friendsTimeline() throws Exception {
		String url = "https://api.weibo.com/2/statuses/public_timeline.json?access_token=2.00LW_xGCF2AIzC77d75c9d320hAXql&count=20";
		HttpClient client = new HttpClient();
		GetMethod method = new GetMethod(url);
		method.getParams().setParameter(HttpMethodParams.RETRY_HANDLER,
				new DefaultHttpMethodRetryHandler(3, false));
		String response = null;
		try {
			int statusCode = client.executeMethod(method);

			if (statusCode != HttpStatus.SC_OK) {
				System.err.println("Method failed: " + method.getStatusLine());
			}
			byte[] responseBody = method.getResponseBody();
			response = new String(responseBody, "utf-8");
		} catch (HttpException e) {
			System.err.println("Fatal protocol violation: " + e.getMessage());
			e.printStackTrace();
		} catch (IOException e) {
			System.err.println("Fatal transport error: " + e.getMessage());
			e.printStackTrace();
		} finally {
			method.releaseConnection();
		}
		JSONObject json = JSONObject.fromObject(response);
		JSONArray array = (JSONArray) json.get("statuses");
		ObjectMapper mapper = new ObjectMapper();
		mapper.setPropertyNamingStrategy(PropertyNamingStrategy.CAMEL_CASE_TO_LOWER_CASE_WITH_UNDERSCORES);
		List<Status> statuses = new ArrayList<Status>();
		for (Object _json : array.toArray()) {
			Status status = mapper.readValue(_json.toString(), Status.class);
			statuses.add(status);
		}
		return statuses;
	}
}
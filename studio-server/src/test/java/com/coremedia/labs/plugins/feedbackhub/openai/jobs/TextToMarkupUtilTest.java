package com.coremedia.labs.plugins.feedbackhub.openai.jobs;

import com.coremedia.xml.Markup;
import org.junit.Assert;
import org.junit.jupiter.api.Test;

public class TextToMarkupUtilTest {

  private final static String LIST_STRING = "abc\n1. eins\n2. zwei\n3. drei\ndef\n";

  @Test
  public void testOrderedLists() {
    Markup markup = TextToMarkupUtil.plainTextToMarkup(LIST_STRING);
    Assert.assertEquals("<div xmlns=\"http://www.coremedia.com/2003/richtext-1.0\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><p>abc</p><ol><li>eins</li><li>zwei</li><li>drei</li></ol>def</div>",
      markup.asXml());
  }
}
